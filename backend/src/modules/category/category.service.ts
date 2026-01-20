import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Category } from "@prisma/client";
import { CategoryWithCount, CreateCategory, UpdateCategory } from "./types";

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAllCategories(): Promise<CategoryWithCount[]> {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: { name: "asc" },
      });

      return categories.map((c) => ({
        ...c,
        merchantCount: 0,
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category)
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);

      return category;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createCategory(body: CreateCategory): Promise<Category> {
    try {
      return await this.prisma.category.create({
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateCategory(id: string, body: UpdateCategory): Promise<Category> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category)
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);

      return await this.prisma.category.update({
        where: { id },
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<Category> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category)
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);

      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
