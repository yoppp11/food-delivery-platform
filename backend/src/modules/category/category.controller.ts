import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { PermissionGuard } from "../../common/guards";
import { Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import { CreateCategorySchema, UpdateCategorySchema } from "./types";
import type {
  CategoryWithCount,
  CreateCategory,
  UpdateCategory,
} from "./types";
import { Category } from "@prisma/client";

@Controller("categories")
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<CategoryWithCount[]> {
    return await this.service.getAllCategories();
  }

  @Get(":id")
  async getCategoryById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<Category> {
    return await this.service.getCategoryById(id);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async createCategory(
    @Body(new ZodValidationPipe(CreateCategorySchema)) body: CreateCategory,
  ): Promise<Category> {
    return await this.service.createCategory(body);
  }

  @Put(":id")
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async updateCategory(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateCategorySchema)) body: UpdateCategory,
  ): Promise<Category> {
    return await this.service.updateCategory(id, body);
  }

  @Delete(":id")
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async deleteCategory(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<Category> {
    return await this.service.deleteCategory(id);
  }
}
