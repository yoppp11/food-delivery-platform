/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import type { Menu, Prisma, User } from "@prisma/client";
import type { CreateMenu } from "../../schemas/menu";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Multer } from "multer";

@Injectable()
export class MenuService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService
  ) {}

  async getAllMenus(): Promise<Menu[]> {
    return await this.prisma.menu.findMany();
  }

  async createMenu(
    user: User,
    body: CreateMenu,
    file: Express.Multer.File
  ): Promise<Menu> {
    try {
      this.logger.warn(file.);

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
