import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Merchant, User, UserStatus } from "@prisma/client";
import {
  AdminUserListResponse,
  DashboardStats,
  UpdateUserStatus,
} from "./types";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    try {
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

      return {
        totalUsers,
        totalMerchants,
        totalDrivers,
        totalOrders,
        totalRevenue,
        todayOrders,
        todayRevenue,
        activeOrders,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 20,
  ): Promise<AdminUserListResponse> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
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
        this.prisma.user.count(),
      ]);

      return {
        data: users,
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

  async getAllMerchants(
    page: number = 1,
    limit: number = 20,
  ): Promise<AdminUserListResponse> {
    try {
      const skip = (page - 1) * limit;

      const [merchants, total] = await this.prisma.$transaction([
        this.prisma.merchant.findMany({
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
        this.prisma.merchant.count(),
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

  async getAllOrders(
    page: number = 1,
    limit: number = 20,
  ): Promise<AdminUserListResponse> {
    try {
      const skip = (page - 1) * limit;

      const [orders, total] = await this.prisma.$transaction([
        this.prisma.order.findMany({
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
          orderBy: { id: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.order.count(),
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
}
