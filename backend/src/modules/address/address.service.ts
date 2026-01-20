import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { User, UserAddres } from "@prisma/client";
import { CreateAddress, UpdateAddress } from "./types";

@Injectable()
export class AddressService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAllAddresses(user: User): Promise<UserAddres[]> {
    try {
      const addresses = await this.prisma.userAddres.findMany({
        where: { userId: user.id },
        orderBy: { isDefault: "desc" },
      });

      return addresses;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAddressById(id: string, user: User): Promise<UserAddres> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const address = await this.prisma.userAddres.findFirst({
        where: { id, userId: user.id },
      });

      if (!address)
        throw new HttpException("Address not found", HttpStatus.NOT_FOUND);

      return address;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createAddress(body: CreateAddress, user: User): Promise<UserAddres> {
    try {
      if (body.isDefault) {
        await this.prisma.userAddres.updateMany({
          where: { userId: user.id },
          data: { isDefault: false },
        });
      }

      const existingAddresses = await this.prisma.userAddres.count({
        where: { userId: user.id },
      });

      return await this.prisma.userAddres.create({
        data: {
          userId: user.id,
          label: body.label,
          address: body.address,
          latitude: body.latitude,
          longitude: body.longitude,
          isDefault: body.isDefault || existingAddresses === 0,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateAddress(
    id: string,
    body: UpdateAddress,
    user: User,
  ): Promise<UserAddres> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const address = await this.prisma.userAddres.findFirst({
        where: { id, userId: user.id },
      });

      if (!address)
        throw new HttpException("Address not found", HttpStatus.NOT_FOUND);

      if (body.isDefault) {
        await this.prisma.userAddres.updateMany({
          where: { userId: user.id, id: { not: id } },
          data: { isDefault: false },
        });
      }

      return await this.prisma.userAddres.update({
        where: { id },
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteAddress(id: string, user: User): Promise<UserAddres> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const address = await this.prisma.userAddres.findFirst({
        where: { id, userId: user.id },
      });

      if (!address)
        throw new HttpException("Address not found", HttpStatus.NOT_FOUND);

      const deleted = await this.prisma.userAddres.delete({
        where: { id },
      });

      if (address.isDefault) {
        const firstAddress = await this.prisma.userAddres.findFirst({
          where: { userId: user.id },
        });

        if (firstAddress) {
          await this.prisma.userAddres.update({
            where: { id: firstAddress.id },
            data: { isDefault: true },
          });
        }
      }

      return deleted;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async setDefaultAddress(id: string, user: User): Promise<UserAddres> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const address = await this.prisma.userAddres.findFirst({
        where: { id, userId: user.id },
      });

      if (!address)
        throw new HttpException("Address not found", HttpStatus.NOT_FOUND);

      await this.prisma.userAddres.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });

      return await this.prisma.userAddres.update({
        where: { id },
        data: { isDefault: true },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
