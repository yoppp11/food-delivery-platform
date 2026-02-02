import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Merchant, User, UserStatus, Role, Promotion, Category } from "@prisma/client";
import {
  AdminUserListResponse,
  DashboardStats,
  UpdateUserStatus,
  CreatePromotion,
  UpdatePromotion,
  CreateCategory,
  UpdateCategory,
} from "./types";
import { CacheService, CacheInvalidationService } from "../../common/cache";

const CACHE_TTL = {
  ADMIN_STATS: 60000,
  ADMIN_USERS: 120000,
  ADMIN_MERCHANTS: 120000,
};

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cacheService: CacheService,
    private cacheInvalidation: CacheInvalidationService,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const cacheKey = "admin:stats";
      const cached = await this.cacheService.get<DashboardStats>(cacheKey);
      if (cached) return cached;
      const [
        totalUsers,
        totalMerchants,
        totalDrivers,
        totalOrders,
        todayOrders,
        activeOrders,
        allOrders,
        todayOrdersList,
      ] = await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.merchant.count(),
        this.prisma.driver.count(),
        this.prisma.order.count(),
        this.prisma.order.count({
          where: {
            id: { not: undefined },
          },
        }),
        this.prisma.order.count({
          where: {
            status: {
              in: ["CREATED", "PAID", "PREPARING", "READY", "ON_DELIVERY"],
            },
          },
        }),
        this.prisma.order.findMany({
          where: { status: "COMPLETED" },
        }),
        this.prisma.order.findMany({
          where: { status: "COMPLETED" },
        }),
      ]);

      const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      const todayRevenue = todayOrdersList.reduce(
        (sum, o) => sum + o.totalPrice,
        0,
      );

      const result = {
        totalUsers,
        totalMerchants,
        totalDrivers,
        totalOrders,
        totalRevenue,
        todayOrders,
        todayRevenue,
        activeOrders,
      };

      await this.cacheService.set(cacheKey, result, CACHE_TTL.ADMIN_STATS);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: string,
    status?: string,
  ): Promise<AdminUserListResponse> {
    try {
      const cacheKey = this.cacheService.generateHashKey("admin:users", { page, limit, search, role, status });
      const cached = await this.cacheService.get<AdminUserListResponse>(cacheKey);
      if (cached) return cached;

      const skip = (page - 1) * limit;
      const where: Record<string, unknown> = {};

      if (search) {
        where.OR = [
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (role) {
        where.role = role;
      }

      if (status) {
        where.status = status;
      }

      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            emailVerified: true,
            image: true,
            phoneNumber: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.user.count({ where }),
      ]);

      const result = {
        data: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      await this.cacheService.set(cacheKey, result, CACHE_TTL.ADMIN_USERS);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateUserStatus(id: string, body: UpdateUserStatus): Promise<User> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user)
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);

      return await this.prisma.user.update({
        where: { id },
        data: { status: body.status as UserStatus },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateUserRole(id: string, role: Role): Promise<User> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user)
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);

      return await this.prisma.user.update({
        where: { id },
        data: { role },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllMerchants(
    page: number = 1,
    limit: number = 20,
    search?: string,
    isOpen?: boolean,
  ): Promise<AdminUserListResponse> {
    try {
      const skip = (page - 1) * limit;
      const where: Record<string, unknown> = {};

      if (search) {
        where.name = { contains: search, mode: "insensitive" };
      }

      if (isOpen !== undefined) {
        where.isOpen = isOpen;
      }

      const [merchants, total] = await this.prisma.$transaction([
        this.prisma.merchant.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                status: true,
              },
            },
            merchantReviews: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.merchant.count({ where }),
      ]);

      const data = merchants.map((m) => ({
        ...m,
        latitude: Number(m.latitude),
        longitude: Number(m.longitude),
        rating: m.rating ? Number(m.rating) : null,
        reviewCount: m.merchantReviews.length,
      }));

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getMerchant(id: string): Promise<Merchant> {
    try {
      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              status: true,
            },
          },
          merchantReviews: true,
        },
      });

      if (!merchant) {
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);
      }

      return merchant;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async verifyMerchant(id: string): Promise<Merchant> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      return await this.prisma.merchant.update({
        where: { id },
        data: { isOpen: true },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllDrivers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    isAvailable?: boolean,
  ): Promise<AdminUserListResponse> {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable;
      }

      const [drivers, total] = await this.prisma.$transaction([
        this.prisma.driver.findMany({
          where,
          include: {
            user: true,
            driverReviews: true,
          },
          orderBy: { id: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.driver.count({ where }),
      ]);

      const data = await Promise.all(
        drivers.map(async (d) => {
          const totalDeliveries = await this.prisma.order.count({
            where: { driverId: d.id, status: "COMPLETED" },
          });
          const avgRating =
            d.driverReviews.length > 0
              ? d.driverReviews.reduce((sum, r) => sum + r.rating, 0) /
                d.driverReviews.length
              : null;
          return {
            ...d,
            totalDeliveries,
            rating: avgRating,
          };
        }),
      );

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllOrders(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    paymentStatus?: string,
  ): Promise<AdminUserListResponse> {
    try {
      const skip = (page - 1) * limit;
      const where: Record<string, unknown> = {};

      if (status) {
        where.status = status;
      }

      if (paymentStatus) {
        where.paymentStatus = paymentStatus;
      }

      const [orders, total] = await this.prisma.$transaction([
        this.prisma.order.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                image: true,
              },
            },
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
            driver: {
              select: {
                id: true,
                plateNumber: true,
              },
            },
            items: true,
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.order.count({ where }),
      ]);

      return {
        data: orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getOrder(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              image: true,
            },
          },
          merchant: {
            select: {
              id: true,
              name: true,
            },
          },
          driver: {
            select: {
              id: true,
              plateNumber: true,
            },
          },
          items: {
            include: {
              menuVariant: true,
            },
          },
        },
      });

      if (!order) {
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
      }

      return order;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getReports(startDate?: Date, endDate?: Date) {
    try {
      const where: Record<string, unknown> = {
        status: "COMPLETED",
      };

      if (startDate && endDate) {
        where.id = { gte: startDate, lte: endDate };
      }

      const orders = await this.prisma.order.findMany({
        where,
        include: {
          merchant: true,
        },
      });

      const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
      const totalOrders = orders.length;

      const merchantStats: Record<
        string,
        { name: string; orders: number; revenue: number }
      > = {};

      for (const order of orders) {
        if (!merchantStats[order.merchantId]) {
          merchantStats[order.merchantId] = {
            name: order.merchant.name,
            orders: 0,
            revenue: 0,
          };
        }
        merchantStats[order.merchantId].orders += 1;
        merchantStats[order.merchantId].revenue += order.totalPrice;
      }

      const topMerchants = Object.entries(merchantStats)
        .map(([id, stats]) => ({ id, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        topMerchants,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllPromotions(
    page: number = 1,
    limit: number = 20,
    search?: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Record<string, unknown> = {};

      if (search) {
        where.code = { contains: search, mode: "insensitive" };
      }

      const [promotions, total] = await this.prisma.$transaction([
        this.prisma.promotion.findMany({
          where,
          orderBy: { expiredAt: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.promotion.count({ where }),
      ]);

      return {
        data: promotions,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createPromotion(body: CreatePromotion): Promise<Promotion> {
    try {
      return await this.prisma.promotion.create({
        data: {
          code: body.code.toUpperCase(),
          discountType: body.discountType,
          discountValue: body.discountValue,
          maxDiscount: body.maxDiscount ?? 0,
          expiredAt: new Date(body.expiredAt),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updatePromotion(id: string, body: UpdatePromotion): Promise<Promotion> {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { id },
      });

      if (!promotion) {
        throw new HttpException("Promotion not found", HttpStatus.NOT_FOUND);
      }

      return await this.prisma.promotion.update({
        where: { id },
        data: {
          ...(body.code && { code: body.code.toUpperCase() }),
          ...(body.discountType && { discountType: body.discountType }),
          ...(body.discountValue && { discountValue: body.discountValue }),
          ...(body.maxDiscount !== undefined && { maxDiscount: body.maxDiscount }),
          ...(body.expiredAt && { expiredAt: new Date(body.expiredAt) }),
          ...(body.isActive !== undefined && { isActive: body.isActive }),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deletePromotion(id: string): Promise<void> {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { id },
      });

      if (!promotion) {
        throw new HttpException("Promotion not found", HttpStatus.NOT_FOUND);
      }

      await this.prisma.promotion.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllCategories(
    page: number = 1,
    limit: number = 20,
    search?: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Record<string, unknown> = {};

      if (search) {
        where.name = { contains: search, mode: "insensitive" };
      }

      const [categories, total] = await this.prisma.$transaction([
        this.prisma.category.findMany({
          where,
          orderBy: { name: "asc" },
          take: limit,
          skip,
        }),
        this.prisma.category.count({ where }),
      ]);

      const data = categories;

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createCategory(body: CreateCategory): Promise<Category> {
    try {
      return await this.prisma.category.create({
        data: {
          name: body.name,
          description: body.description,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateCategory(id: string, body: UpdateCategory): Promise<Category> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
      }

      return await this.prisma.category.update({
        where: { id },
        data: {
          ...(body.name && { name: body.name }),
          ...(body.description !== undefined && { description: body.description }),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
      }

      await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
