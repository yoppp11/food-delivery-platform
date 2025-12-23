/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import type { Menu, Prisma, User } from "@prisma/client";
import type { CreateMenu } from "../../schemas/menu";

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getAllMenus(): Promise<Menu[]> {
    return await this.prisma.menu.findMany();
  }

  async createMenu(user: User, body: CreateMenu): Promise<Menu> {
    try {
      const menu = await this.prisma.menu.create({
        data: {
          name: body.name,
          categoryId: body.categoryId,
          description: body.description ?? "",
          price: body.price,
          isAvailable: body.isAvailable,
          imageId: "",
          merchantId: user.id,
          createdAt: new Date(),
        } satisfies Prisma.MenuUncheckedCreateInput,
      });

      return menu;
    } catch (error) {
      return error;
    }
  }
}
