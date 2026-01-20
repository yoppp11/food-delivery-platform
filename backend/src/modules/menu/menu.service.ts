/* eslint-disable no-case-declarations */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import type { Image, Merchant, User } from "@prisma/client";
import type { CreateMenu, UpdateMenu } from "../../schemas/menu";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { DeleteMenuResponse, Menu, MenuApiResponse } from "./types";

@Injectable()
export class MenuService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService,
  ) {}

  async getAllMenus(
    user: User,
    search: string = "",
    page: number = 1,
  ): Promise<MenuApiResponse> {
    const where: Record<string, unknown> = {};

    switch (user.role) {
      case "MERCHANT":
        const merchant = await this.prisma.merchant.findFirst({
          where: {
            ownerId: user.id,
          },
        });
        where.merchantId = merchant?.id;
        break;
    }
    where.isAvailable = true;

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const limit = 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.menu.findMany({
        where,
        include: {
          category: true,
          menuVariants: true,
        },
        take: limit,
        skip,
      }),
      this.prisma.menu.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getById(id: string) {
    try {
      if (!id) {
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);
      }

      const menu = await this.prisma.menu.findUnique({
        where: { id },
        include: {
          category: true,
          menuVariants: true,
        },
      });

      if (!menu) {
        throw new HttpException("Menu not found", HttpStatus.NOT_FOUND);
      }

      return menu;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createMenu(
    user: User,
    merchant: Merchant,
    body: CreateMenu,
    file: Express.Multer.File,
  ): Promise<Menu> {
    try {
      let image: Image | null = null;

      const category = await this.prisma.merchantMenuCategory.findFirst({
        where: { id: body.categoryId },
      });

      if (!category) {
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
      }

      if (file) {
        image = await this.prisma.image.create({
          data: {
            imageUrl: file.path,
          },
        });
      }

      const defaultMenuVariant = {
        name: "Regular",
        price: body.price,
      };

      const variants = (body.menuVariants ?? [defaultMenuVariant]).map((m) => {
        return {
          name: m.name,
          price: m.price,
        };
      });

      const menu = await this.prisma.menu.create({
        data: {
          ...body,
          price: Number(body.price),
          isAvailable:
            body.isAvailable === true ||
            (body.isAvailable as unknown) === "true",
          imageId: image?.id ?? null,
          merchantId: user.role === "MERCHANT" ? merchant.id : "",
          menuVariants: {
            create: variants,
          },
        },
        include: {
          menuVariants: true,
        },
      });

      return menu;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateMenu(id: string, body: UpdateMenu): Promise<Menu> {
    try {
      if (!id) {
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);
      }

      const updateData = await this.prisma.menu.update({
        where: { id },
        data: {
          name: body.name,
          description: body.description,
          price: body.price,
          isAvailable: body.isAvailable,

          image: body.imageId ? { connect: { id: body.imageId } } : undefined,
        },
      });

      return updateData;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async deleteMenu(id: string): Promise<DeleteMenuResponse> {
    try {
      if (!id) {
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);
      }

      const deletedMenu = await this.prisma.menu.delete({
        where: { id },
      });

      return {
        data: deletedMenu,
        message: "Successfully deleted menu",
      };
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
