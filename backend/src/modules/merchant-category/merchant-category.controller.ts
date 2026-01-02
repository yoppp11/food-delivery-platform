import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import type { Merchant, MerchantMenuCategory, User } from "@prisma/client";
import { BadRequestError } from "../../common/exception.filter";
import type { CreateCategory } from "../../schemas/category";
import { CurrentMerchant, CurrentUser } from "../../common/decorators";
import { MerchantCategoryService } from "./merchant-category.service";
import { MerchantGuard, PermissionGuard } from "../../common/guard";

@Controller("merchant-categories")
@UseGuards(PermissionGuard)
export class MerchantCategoryController {
  constructor(private services: MerchantCategoryService) {}

  @Get()
  async getAllCategories(): Promise<MerchantMenuCategory[]> {
    return await this.services.getAllCategory();
  }

  @Get()
  async getById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<MerchantMenuCategory> {
    return await this.services.getById(id);
  }

  @Post()
  @UseGuards(MerchantGuard)
  @UseFilters(BadRequestError)
  async createCategory(
    @Body() body: CreateCategory,
    @CurrentUser() user: User,
    @CurrentMerchant() merchant: Merchant,
  ): Promise<MerchantMenuCategory> {
    return this.services.createCategory(body, user, merchant);
  }
}
