/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { CreateMerchantRequest } from "../../schemas/merchant";
import { UserResponse } from "../../schemas/user";
import type { Merchant, MerchantOperationalHour, User } from "@prisma/client";
import {
  Coordinate,
  CreateOperationalHour,
  GetMerchantsQuery,
  MerchantListResponse,
  UpdateMerchant,
  UpdateOperationalHour,
} from "./types";

@Injectable()
export class MerchantService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  private calculateDistance(point1: Coordinate, point2: Coordinate): number {
    const R = 6371;
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLon = this.toRad(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.latitude)) *
        Math.cos(this.toRad(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100;
  }

  async getAllMerchants(
    query: GetMerchantsQuery,
  ): Promise<MerchantListResponse> {
    try {
      const { search, isOpen, sortBy, order, page, limit, lat, lng } = query;

      const where: Record<string, unknown> = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (isOpen !== undefined) {
        where.isOpen = isOpen === "true";
      }

      const skip = (page - 1) * limit;

      const orderBy: Record<string, string> = {};
      if (sortBy && sortBy !== "distance") {
        orderBy[sortBy] = order || "desc";
      } else if (!sortBy) {
        orderBy.createdAt = "desc";
      }

      const [merchants, total] = await this.prisma.$transaction([
        this.prisma.merchant.findMany({
          where,
          include: {
            merchantReviews: true,
          },
          orderBy: sortBy !== "distance" ? orderBy : undefined,
          take: limit,
          skip,
        }),
        this.prisma.merchant.count({ where }),
      ]);

      let data = merchants.map((m) => ({
        ...m,
        latitude: Number(m.latitude),
        longitude: Number(m.longitude),
        rating: m.rating ? Number(m.rating) : null,
        reviewCount: m.merchantReviews.length,
        distance:
          lat && lng
            ? this.calculateDistance(
                { latitude: lat, longitude: lng },
                {
                  latitude: Number(m.latitude),
                  longitude: Number(m.longitude),
                },
              )
            : null,
      }));

      if (sortBy === "distance" && lat && lng) {
        data = data.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return order === "asc"
            ? a.distance - b.distance
            : b.distance - a.distance;
        });
      }

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

  async getMerchantById(id: string) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
        include: {
          merchantOperationalHours: true,
          merchantCategories: {
            include: {
              menus: {
                include: {
                  menuVariants: true,
                  image: true,
                },
              },
            },
          },
          merchantReviews: {
            include: {
              user: {
                select: {
                  id: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      return {
        ...merchant,
        latitude: Number(merchant.latitude),
        longitude: Number(merchant.longitude),
        rating: merchant.rating ? Number(merchant.rating) : null,
        reviewCount: merchant.merchantReviews.length,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getFeaturedMerchants(limit: number = 10) {
    try {
      const merchants = await this.prisma.merchant.findMany({
        where: { isOpen: true },
        orderBy: { rating: "desc" },
        take: limit,
        include: {
          merchantReviews: true,
        },
      });

      return merchants.map((m) => ({
        ...m,
        latitude: Number(m.latitude),
        longitude: Number(m.longitude),
        rating: m.rating ? Number(m.rating) : null,
        reviewCount: m.merchantReviews.length,
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getNearbyMerchants(lat: number, lng: number, maxDistance: number = 10) {
    try {
      const merchants = await this.prisma.merchant.findMany({
        where: { isOpen: true },
        include: {
          merchantReviews: true,
        },
      });

      const userLocation: Coordinate = { latitude: lat, longitude: lng };

      return merchants
        .map((m) => {
          const distance = this.calculateDistance(userLocation, {
            latitude: Number(m.latitude),
            longitude: Number(m.longitude),
          });
          return {
            ...m,
            latitude: Number(m.latitude),
            longitude: Number(m.longitude),
            rating: m.rating ? Number(m.rating) : null,
            reviewCount: m.merchantReviews.length,
            distance,
          };
        })
        .filter((m) => m.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateMerchant(
    id: string,
    body: UpdateMerchant,
    user: User,
  ): Promise<Merchant> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      if (merchant.ownerId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      return await this.prisma.merchant.update({
        where: { id },
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteMerchant(id: string, user: User): Promise<Merchant> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      if (merchant.ownerId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      return await this.prisma.merchant.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async toggleStatus(id: string, user: User): Promise<Merchant> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      if (merchant.ownerId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      return await this.prisma.merchant.update({
        where: { id },
        data: { isOpen: !merchant.isOpen },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getMerchantMenus(id: string) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
        include: {
          merchantCategories: {
            include: {
              menus: {
                include: {
                  menuVariants: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      return merchant.merchantCategories;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getMerchantReviews(id: string, page: number = 1, limit: number = 20) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      const skip = (page - 1) * limit;

      const [reviews, total] = await this.prisma.$transaction([
        this.prisma.merchantReview.findMany({
          where: { merchantId: id },
          include: {
            user: {
              select: {
                id: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.merchantReview.count({ where: { merchantId: id } }),
      ]);

      return {
        data: reviews,
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

  async getOperationalHours(id: string): Promise<MerchantOperationalHour[]> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      return await this.prisma.merchantOperationalHour.findMany({
        where: { merchantId: id },
        orderBy: { dayOfWeek: "asc" },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createOperationalHour(
    id: string,
    body: CreateOperationalHour,
    user: User,
  ): Promise<MerchantOperationalHour> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      if (merchant.ownerId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      const existing = await this.prisma.merchantOperationalHour.findFirst({
        where: { merchantId: id, dayOfWeek: body.dayOfWeek },
      });

      if (existing)
        throw new HttpException(
          "Operational hour for this day already exists",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.merchantOperationalHour.create({
        data: {
          merchantId: id,
          ...body,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateOperationalHour(
    id: string,
    hourId: string,
    body: UpdateOperationalHour,
    user: User,
  ): Promise<MerchantOperationalHour> {
    try {
      if (!id || !hourId)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      if (merchant.ownerId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      const operationalHour =
        await this.prisma.merchantOperationalHour.findUnique({
          where: { id: hourId },
        });

      if (!operationalHour)
        throw new HttpException(
          "Operational hour not found",
          HttpStatus.NOT_FOUND,
        );

      return await this.prisma.merchantOperationalHour.update({
        where: { id: hourId },
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteOperationalHour(
    id: string,
    hourId: string,
    user: User,
  ): Promise<MerchantOperationalHour> {
    try {
      if (!id || !hourId)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      if (merchant.ownerId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      return await this.prisma.merchantOperationalHour.delete({
        where: { id: hourId },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createTenant(data: CreateMerchantRequest): Promise<Merchant> {
    try {
      const response = await fetch("http://localhost:3000/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        headers: {
          Origin: "http://localhost:3000",
          "Content-type": "application/json",
        },
      });

      const responseData: UserResponse = await response.json();

      this.logger.info(response.status);
      this.logger.info(response.ok);
      this.logger.info(responseData);

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const user = await this.prisma.merchant.create({
        data: {
          ownerId: responseData.user.id,
          name: data.name,
          description: data.description ?? null,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      });

      return user;
    } catch (error) {
      this.logger.error(error, "<====");
      this.logger.error(typeof error);
      throw error;
    }
  }
}
