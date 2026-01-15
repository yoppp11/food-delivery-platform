/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { Coordinate } from "./types";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Driver, DriverLocation, Prisma, User } from "@prisma/client";

@Injectable()
export class DriverService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
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

  async findDriver(merchantId: string, maxDistance: number = 10) {
    try {
      if (!merchantId)
        throw new HttpException(
          "Merchant ID is required",
          HttpStatus.BAD_REQUEST
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
            }
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

  async updateLocation(id: string, location: Coordinate): Promise<DriverLocation> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const driver = await this.prisma.driver.findFirst({
        where: { id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const driverLocation = await this.prisma.driverLocation.findFirst({
        where: { driverId: id },
      });

      if (!driverLocation)
        throw new HttpException("Driver location not found", HttpStatus.NOT_FOUND);

      return await this.prisma.driverLocation.update({
        where: { id: driverLocation.id },
        data: {
            latitude: new Prisma.Decimal(location.latitude),
            longitude: new Prisma.Decimal(location.longitude)
        }
      })
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
}
