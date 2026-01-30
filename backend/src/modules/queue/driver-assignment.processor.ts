import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { OrderGateway } from "../order/order.gateway";

export interface DriverAssignmentJobData {
  orderId: string;
  merchantId: string;
}

@Injectable()
@Processor("driver-assignment")
export class DriverAssignmentProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderGateway: OrderGateway,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<DriverAssignmentJobData>): Promise<void> {
    const { orderId, merchantId } = job.data;
    this.logger.info(`Processing driver assignment for order ${orderId}`);

    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        this.logger.warn(`Order ${orderId} not found, skipping assignment`);
        return;
      }

      if (order.driverId) {
        this.logger.info(`Order ${orderId} already has driver assigned`);
        return;
      }

      if (order.status !== "READY") {
        this.logger.info(`Order ${orderId} status is ${order.status}, skipping`);
        return;
      }

      const nearestDriver = await this.findNearestDriver(merchantId);

      if (!nearestDriver) {
        this.logger.info(`No available driver found for order ${orderId}`);
        return;
      }

      const driverWithUser = await this.prisma.driver.findUnique({
        where: { id: nearestDriver.driverId },
        include: {
          user: {
            select: { id: true, email: true, image: true },
          },
          driverLocations: {
            orderBy: { recordedAt: "desc" },
            take: 1,
          },
        },
      });

      if (!driverWithUser) {
        this.logger.warn(`Driver ${nearestDriver.driverId} not found`);
        return;
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { driverId: nearestDriver.driverId },
        });

        await tx.delivery.create({
          data: {
            orderId,
            driverId: nearestDriver.driverId,
            pickedAt: new Date(),
            deliveredAt: new Date(),
            distanceKm: nearestDriver.distance,
          },
        });
      });

      const fullOrder = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { merchant: true },
      });

      this.orderGateway.notifyDriverAssigned(orderId, {
        id: driverWithUser.id,
        userId: driverWithUser.userId,
        plateNumber: driverWithUser.plateNumber,
        user: driverWithUser.user,
        currentLocation: driverWithUser.driverLocations[0]
          ? {
              latitude: Number(driverWithUser.driverLocations[0].latitude),
              longitude: Number(driverWithUser.driverLocations[0].longitude),
            }
          : null,
      });

      this.orderGateway.notifyDriverNewOrder(driverWithUser.user.id, {
        orderId,
        merchant: fullOrder?.merchant,
      });

      if (fullOrder) {
        await this.prisma.notification.create({
          data: {
            userId: fullOrder.userId,
            type: "ORDER",
            message: `A driver has been assigned to your order! ${driverWithUser.user.email} will deliver your order.`,
            isRead: false,
          },
        });

        await this.prisma.notification.create({
          data: {
            userId: driverWithUser.user.id,
            type: "ORDER",
            message: `New delivery assigned! Pick up from ${fullOrder.merchant.name}.`,
            isRead: false,
          },
        });
      }

      this.logger.info(
        `Auto-assigned driver ${nearestDriver.driverId} to order ${orderId}`,
      );
    } catch (error) {
      this.logger.error(`Error in driver assignment job: ${error}`);
      throw error;
    }
  }

  private async findNearestDriver(
    merchantId: string,
    maxDistance: number = 10,
  ): Promise<{ driverId: string; distance: number } | null> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    if (!merchant) return null;

    const availableDrivers = await this.prisma.driver.findMany({
      where: {
        isAvailable: true,
        approvalStatus: "APPROVED",
      },
      include: {
        driverLocations: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
    });

    const drivers = availableDrivers
      .filter(
        (driver) => driver.isAvailable && driver.driverLocations.length > 0,
      )
      .map((driver) => {
        const location = driver.driverLocations[0];
        const distance = this.calculateDistance(
          Number(merchant.latitude),
          Number(merchant.longitude),
          Number(location.latitude),
          Number(location.longitude),
        );
        return { driverId: driver.id, distance };
      })
      .filter((d) => d.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    return drivers.length > 0 ? drivers[0] : null;
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

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}
