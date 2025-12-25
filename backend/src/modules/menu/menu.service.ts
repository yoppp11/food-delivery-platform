/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import type { Prisma, User } from "@prisma/client";
import type { CreateMenu, UpdateMenu } from "../../schemas/menu";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Menu, MenuApiResponse } from "./types";

@Injectable()
export class MenuService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService,
  ) {}

  async getAllMenus(
    merchantId: string,
    search: string,
    page: number,
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

    this.logger.info(result);

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
    file: Express.Multer.File,
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

  async updateMenu(id: string, body: UpdateMenu): Promise<Menu> {
    try {
      if (!id) {
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);
      }

      const menu = await this.prisma.menu.findUnique({
        where: {
          id,
        },
      });

      if (!menu) {
        throw new HttpException("Menu not found", HttpStatus.NOT_FOUND);
      }

      const updateData = await this.prisma.menu.update({
        where: { id },
        data: body,
      });

      return updateData;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
