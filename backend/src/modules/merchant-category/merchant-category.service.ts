import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Merchant, MerchantMenuCategory, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { CreateCategory, UpdateCategory } from "../../schemas/category";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class MerchantCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async getAllCategory(merchantId?: string): Promise<MerchantMenuCategory[]> {
    const where: { merchantId?: string } = {};
    if (merchantId) {
      where.merchantId = merchantId;
    }
    return await this.prisma.merchantMenuCategory.findMany({
      where,
      include: {
        _count: {
          select: { menus: true },
        },
      },
      orderBy: { id: "asc" },
    });
  }

  async getById(id: string): Promise<MerchantMenuCategory> {
    try {
      if (!id) {
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);
      }

      const category = await this.prisma.merchantMenuCategory.findFirst({
        where: { id },
      });

      if (!category) {
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
      }

      return category;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createCategory(
    body: CreateCategory,
    user: User,
    merchant: Merchant,
  ): Promise<MerchantMenuCategory> {
    try {
      this.logger.info(body);

      const category = await this.prisma.merchantMenuCategory.create({
        data: {
          ...body,
          merchantId: merchant.id,
        },
      });

      return category;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateCategory(
    id: string,
    body: UpdateCategory,
    merchant: Merchant,
  ): Promise<MerchantMenuCategory> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const updatedData = await this.prisma.merchantMenuCategory.update({
        where: { id },
        data: {
          ...body,
          merchantId: merchant.id,
        },
      });

      return updatedData;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const category = await this.prisma.merchantMenuCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: { menus: true },
          },
        },
      });

      if (!category)
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);

      if (category._count.menus > 0)
        throw new HttpException(
          "Cannot delete category with existing menu items. Please remove or reassign the menus first.",
          HttpStatus.BAD_REQUEST,
        );

      await this.prisma.merchantMenuCategory.delete({
        where: { id },
      });

      return "Menu category successfully deleted";
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
