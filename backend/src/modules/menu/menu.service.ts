/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import type { Prisma, User } from "@prisma/client";
import type { CreateMenu } from "../../schemas/menu";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Menu, MenuApiResponse } from "./types";

@Injectable()
export class MenuService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService
  ) {}

  async getAllMenus(
    merchantId: string,
    search: string,
    page: number
  ): Promise<MenuApiResponse> {
    const where: Record<string, unknown> = {};

    where.merchantId = merchantId;
    where.isAvailable = true;

    const limit = 20;
    const skip = (page - 1) * limit;

    const result = await this.prisma.menu.findMany({
      where: {
        merchantId,
        isAvailable: true,
      },
      include: {
        category: true,
        menuVariants: true,
      },
      take: limit,
      skip,
    });

    this.logger.info(result)

    const total = await this.prisma.menu.count({ where });

    return {
      data: result,
      total,
      page,
      limit,
    };
  }

  async createMenu(
    user: User,
    body: CreateMenu,
    file: Express.Multer.File
  ): Promise<Menu> {
    try {
      this.logger.warn(file.path);

      // const base64 = base64(file.buffer).toString()

      // const image = cloudinary.uploader.upload(file)

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
