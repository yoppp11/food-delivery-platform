import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { Coordinate } from "./types";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Driver, DriverLocation, Prisma, User } from "@prisma/client";
import { CacheService, CacheInvalidationService } from "../../common/cache";

const CACHE_TTL = {
  DRIVER_DETAIL: 300000,
  DRIVERS_AVAILABLE: 30000,
};

@Injectable()
export class DriverService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cacheService: CacheService,
    private cacheInvalidation: CacheInvalidationService,
  ) {}

  async getDrivers() {
    try {
      const drivers = await this.prisma.driver.findMany();

      if (!drivers)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      return drivers;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDriver(id: string) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const cacheKey = `driver:${id}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) return cached;

      const driver = await this.prisma.driver.findUnique({
        where: { id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      await this.cacheService.set(cacheKey, driver, CACHE_TTL.DRIVER_DETAIL);

      return driver;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

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

  async findDriver(merchantId: string, maxDistance: number = 10) {
    try {
      if (!merchantId)
        throw new HttpException(
          "Merchant ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const merchant = await this.prisma.merchant.findUnique({
        where: { id: merchantId },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      const availableDrivers = await this.prisma.driver.findMany({
        where: { isAvailable: true },
        include: {
          driverLocations: true,
        },
      });

      if (!availableDrivers)
        throw new HttpException("Drivers not found", HttpStatus.NOT_FOUND);

      const drivers = availableDrivers
        .filter((driver) => driver.isAvailable)
        .map((driver) => {
          const driverLocation = driver.driverLocations[0];
          const distance = this.calculateDistance(
            {
              latitude: Number(merchant.latitude),
              longitude: Number(merchant.longitude),
            },
            {
              latitude: Number(driverLocation.latitude),
              longitude: Number(driverLocation.longitude),
            },
          );

          return {
            driverId: driver.id,
            userId: driver.userId,
            distance,
          };
        })
        .filter((driver) => driver.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);

      return drivers.length > 0 ? drivers[0] : null;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateLocation(
    user: User,
    location: Coordinate,
  ): Promise<DriverLocation> {
    try {
      if (!user)
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);

      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      return await this.prisma.driverLocation.create({
        data: {
          driverId: driver.id,
          latitude: new Prisma.Decimal(location.latitude),
          longitude: new Prisma.Decimal(location.longitude),
          recordedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDetailDriver(user: User): Promise<Driver> {
    try {
      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      return driver;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async toggleAvailability(user: User, isAvailable: boolean) {
    try {
      if (!user)
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);

      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const updatedDriver = await this.prisma.driver.update({
        where: { id: driver.id },
        data: { isAvailable },
      });

      return updatedDriver;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async registerDriver(
    user: User,
    body: { plateNumber: string; latitude: number; longitude: number },
  ): Promise<Driver> {
    try {
      const existingDriver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (existingDriver)
        throw new HttpException(
          "User is already registered as a driver",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.$transaction(async (tx) => {
        const driver = await tx.driver.create({
          data: {
            userId: user.id,
            plateNumber: body.plateNumber,
            isAvailable: false, 
            approvalStatus: "PENDING",
          },
        });

        await tx.driverLocation.create({
          data: {
            driverId: driver.id,
            latitude: new Prisma.Decimal(body.latitude),
            longitude: new Prisma.Decimal(body.longitude),
            recordedAt: new Date(),
          },
        });

        return driver;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateDriverProfile(
    user: User,
    body: { plateNumber?: string },
  ): Promise<Driver> {
    try {
      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      return await this.prisma.driver.update({
        where: { id: driver.id },
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getEarnings(user: User) {
    try {
      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const deliveries = await this.prisma.delivery.findMany({
        where: { driverId: driver.id },
        include: {
          order: true,
        },
      });

      const DELIVERY_FEE_PER_KM = 2000;

      const todayDeliveries = deliveries.filter(
        (d) => d.deliveredAt && new Date(d.deliveredAt) >= startOfDay,
      );
      const weekDeliveries = deliveries.filter(
        (d) => d.deliveredAt && new Date(d.deliveredAt) >= startOfWeek,
      );
      const monthDeliveries = deliveries.filter(
        (d) => d.deliveredAt && new Date(d.deliveredAt) >= startOfMonth,
      );

      const calculateEarnings = (dels: typeof deliveries) =>
        dels.reduce(
          (sum, d) => sum + Number(d.distanceKm || 0) * DELIVERY_FEE_PER_KM,
          0,
        );

      return {
        today: calculateEarnings(todayDeliveries),
        thisWeek: calculateEarnings(weekDeliveries),
        thisMonth: calculateEarnings(monthDeliveries),
        totalDeliveries: deliveries.length,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getEarningsHistory(user: User, page: number = 1, limit: number = 20) {
    try {
      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const skip = (page - 1) * limit;

      const [deliveries, total] = await this.prisma.$transaction([
        this.prisma.delivery.findMany({
          where: { driverId: driver.id },
          include: {
            order: {
              include: {
                merchant: true,
              },
            },
          },
          orderBy: { deliveredAt: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.delivery.count({ where: { driverId: driver.id } }),
      ]);

      const DELIVERY_FEE_PER_KM = 2000;

      const data = deliveries.map((d) => ({
        id: d.id,
        orderId: d.orderId,
        merchantName: d.order.merchant.name,
        distanceKm: Number(d.distanceKm || 0),
        earnings: Number(d.distanceKm || 0) * DELIVERY_FEE_PER_KM,
        deliveredAt: d.deliveredAt,
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

  async approveDriver(driverId: string): Promise<Driver> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { id: driverId },
        include: { user: true },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      if (driver.approvalStatus === "APPROVED")
        throw new HttpException(
          "Driver is already approved",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.$transaction(async (tx) => {
        const updatedDriver = await tx.driver.update({
          where: { id: driverId },
          data: {
            approvalStatus: "APPROVED",
            isAvailable: true,
          },
        });

        // Update user role to DRIVER
        await tx.user.update({
          where: { id: driver.userId },
          data: { role: "DRIVER" },
        });

        return updatedDriver;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async rejectDriver(driverId: string): Promise<Driver> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { id: driverId },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      if (driver.approvalStatus === "REJECTED")
        throw new HttpException(
          "Driver is already rejected",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.driver.update({
        where: { id: driverId },
        data: {
          approvalStatus: "REJECTED",
          isAvailable: false,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPendingDrivers() {
    try {
      return await this.prisma.driver.findMany({
        where: { approvalStatus: "PENDING" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phoneNumber: true,
              createdAt: true,
            },
          },
        },
        orderBy: { user: { createdAt: "desc" } },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
