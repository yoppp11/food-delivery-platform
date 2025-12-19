import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../services/prisma/prisma.service";
import { UpdateUserRequest, UpdateUserSchema } from "../../validations/user";
import { User } from "../../generated/zod";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      if (!id) throw new Error("ID is required");

      const updateUserRequest = UpdateUserSchema.parse(data);
      const user = await this.prisma.user.update({
        where: { id },
        data: { updateUserRequest },
      });

      return user;
    } catch (error) {
      Logger.error(error);
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
      Logger.error(error);
    }
  }
}
