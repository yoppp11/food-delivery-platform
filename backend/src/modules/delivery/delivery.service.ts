import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Delivery, User } from "@prisma/client";
import { AssignDriver, DeliveryDetails, TrackingInfo } from "./types";

@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  async getDeliveryByOrderId(orderId: string): Promise<DeliveryDetails | null> {
    try {
      if (!orderId)
        throw new HttpException("Order ID is required", HttpStatus.BAD_REQUEST);

      const delivery = await this.prisma.delivery.findFirst({
        where: { orderId },
        include: {
          driver: {
            include: {
              driverLocations: {
                orderBy: { recordedAt: "desc" },
                take: 1,
              },
            },
          },
          order: {
            include: {
              merchant: true,
            },
          },
        },
      });

      if (!delivery) return null;

      return {
        id: delivery.id,
        orderId: delivery.orderId,
        driverId: delivery.driverId,
        pickedAt: delivery.pickedAt,
        deliveredAt: delivery.deliveredAt,
        distanceKm: delivery.distanceKm ? Number(delivery.distanceKm) : null,
        driver: {
          id: delivery.driver.id,
          userId: delivery.driver.userId,
          plateNumber: delivery.driver.plateNumber,
          isAvailable: delivery.driver.isAvailable,
          currentLocation: delivery.driver.driverLocations[0]
            ? {
                latitude: Number(delivery.driver.driverLocations[0].latitude),
                longitude: Number(delivery.driver.driverLocations[0].longitude),
              }
            : undefined,
        },
        order: {
          id: delivery.order.id,
          status: delivery.order.status,
          merchantId: delivery.order.merchantId,
          merchant: {
            name: delivery.order.merchant.name,
            latitude: Number(delivery.order.merchant.latitude),
            longitude: Number(delivery.order.merchant.longitude),
          },
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async assignDriver(orderId: string, body: AssignDriver): Promise<Delivery> {
    try {
      if (!orderId)
        throw new HttpException("Order ID is required", HttpStatus.BAD_REQUEST);

      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { merchant: true },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      if (order.status !== "READY")
        throw new HttpException(
          "Order is not ready for delivery",
          HttpStatus.BAD_REQUEST,
        );

      const driver = await this.prisma.driver.findUnique({
        where: { id: body.driverId },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      if (!driver.isAvailable)
        throw new HttpException(
          "Driver is not available",
          HttpStatus.BAD_REQUEST,
        );

      const existingDelivery = await this.prisma.delivery.findFirst({
        where: { orderId },
      });

      if (existingDelivery)
        throw new HttpException(
          "Delivery already assigned",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.$transaction(async (tx) => {
        const delivery = await tx.delivery.create({
          data: {
            orderId,
            driverId: body.driverId,
            pickedAt: new Date(),
            deliveredAt: new Date(),
            distanceKm: 0,
          },
        });

        await tx.order.update({
          where: { id: orderId },
          data: {
            driverId: body.driverId,
            status: "ON_DELIVERY",
          },
        });

        await tx.driver.update({
          where: { id: body.driverId },
          data: { isAvailable: false },
        });

        return delivery;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async markAsPickedUp(orderId: string, user: User): Promise<Delivery> {
    try {
      if (!orderId)
        throw new HttpException("Order ID is required", HttpStatus.BAD_REQUEST);

      const delivery = await this.prisma.delivery.findFirst({
        where: { orderId },
        include: { driver: true },
      });

      if (!delivery)
        throw new HttpException("Delivery not found", HttpStatus.NOT_FOUND);

      if (delivery.driver.userId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      return await this.prisma.delivery.update({
        where: { id: delivery.id },
        data: { pickedAt: new Date() },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async markAsCompleted(orderId: string, user: User): Promise<Delivery> {
    try {
      if (!orderId)
        throw new HttpException("Order ID is required", HttpStatus.BAD_REQUEST);

      const delivery = await this.prisma.delivery.findFirst({
        where: { orderId },
        include: {
          driver: {
            include: {
              driverLocations: { orderBy: { recordedAt: "desc" }, take: 1 },
            },
          },
          order: { include: { merchant: true } },
        },
      });

      if (!delivery)
        throw new HttpException("Delivery not found", HttpStatus.NOT_FOUND);

      if (delivery.driver.userId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      const driverLocation = delivery.driver.driverLocations[0];
      let distanceKm = 0;

      if (driverLocation) {
        distanceKm = this.calculateDistance(
          Number(delivery.order.merchant.latitude),
          Number(delivery.order.merchant.longitude),
          Number(driverLocation.latitude),
          Number(driverLocation.longitude),
        );
      }

      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.delivery.update({
          where: { id: delivery.id },
          data: {
            deliveredAt: new Date(),
            distanceKm,
          },
        });

        await tx.order.update({
          where: { id: orderId },
          data: { status: "COMPLETED" },
        });

        await tx.driver.update({
          where: { id: delivery.driverId },
          data: { isAvailable: true },
        });

        return updated;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getTrackingInfo(orderId: string): Promise<TrackingInfo> {
    try {
      if (!orderId)
        throw new HttpException("Order ID is required", HttpStatus.BAD_REQUEST);

      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          driver: {
            include: {
              driverLocations: {
                orderBy: { recordedAt: "desc" },
                take: 1,
              },
            },
          },
        },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      return {
        orderId: order.id,
        status: order.status,
        driver: order.driver
          ? {
              id: order.driver.id,
              plateNumber: order.driver.plateNumber,
              location: order.driver.driverLocations[0]
                ? {
                    latitude: Number(order.driver.driverLocations[0].latitude),
                    longitude: Number(
                      order.driver.driverLocations[0].longitude,
                    ),
                  }
                : null,
            }
          : null,
        estimatedDeliveryTime:
          order.status === "ON_DELIVERY" ? "15-30 minutes" : null,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDriverDeliveryHistory(
    user: User,
    page: number = 1,
    limit: number = 20,
  ) {
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
                user: {
                  select: {
                    id: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { deliveredAt: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.delivery.count({ where: { driverId: driver.id } }),
      ]);

      return {
        data: deliveries,
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
}
