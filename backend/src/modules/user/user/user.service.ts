import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { User } from "../../../generated/zod";
import { PrismaService } from "../../../lib/prisma.service";
import { UpdateUserRequest, UpdateUserSchema } from "../../../validations/user";
import { ValidationService } from "../../../validation/validation.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      if (!id) throw new Error("ID is required");

      const updateUserRequest = this.validation.validate(
        UpdateUserSchema,
        data,
      );
      this.logger.info(updateUserRequest);
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserRequest,
      });

      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      if (!id) throw new Error("cannot find id");

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) throw new Error("user not found");

      await this.prisma.user.delete({
        where: { id },
      });

      return "Successfully delete user";
    } catch (error) {
      this.logger.error(error);
    }
  }
}
