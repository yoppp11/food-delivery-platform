import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Category } from "@prisma/client";
import { CategoryWithCount, CreateCategory, UpdateCategory } from "./types";
import { CacheService, CacheInvalidationService } from "../../common/cache";

const CACHE_TTL = {
  CATEGORIES_ALL: 1800000,
  CATEGORY_DETAIL: 1800000,
};

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cacheService: CacheService,
    private cacheInvalidation: CacheInvalidationService,
  ) {}

  async getAllCategories(): Promise<CategoryWithCount[]> {
    try {
      const cacheKey = "categories:all";
      const cached = await this.cacheService.get<CategoryWithCount[]>(cacheKey);
      if (cached) return cached;

      const categories = await this.prisma.category.findMany({
        orderBy: { name: "asc" },
      });

      const result = categories.map((c) => ({
        ...c,
        merchantCount: 0,
      }));

      await this.cacheService.set(cacheKey, result, CACHE_TTL.CATEGORIES_ALL);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const cacheKey = `category:${id}`;
      const cached = await this.cacheService.get<Category>(cacheKey);
      if (cached) return cached;

      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category)
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);

      await this.cacheService.set(cacheKey, category, CACHE_TTL.CATEGORY_DETAIL);

      return category;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createCategory(body: CreateCategory): Promise<Category> {
    try {
      const result = await this.prisma.category.create({
        data: body,
      });

      await this.cacheInvalidation.invalidateCategoryCache();

      return result;
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

      const result = await this.prisma.category.update({
        where: { id },
        data: body,
      });

      await this.cacheInvalidation.invalidateCategoryCache();

      return result;
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

      const result = await this.prisma.category.delete({
        where: { id },
      });

      await this.cacheInvalidation.invalidateCategoryCache();

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
