/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import type { Merchant, MerchantMenuCategory, User } from "@prisma/client";
import { BadRequestError } from "../../common/exception.filter";
import {
  CreateMenuCategorySchema,
  UpdateMenuCategorySchema,
  type CreateCategory,
  type UpdateCategory,
} from "../../schemas/category";
import { CurrentMerchant, CurrentUser, Roles } from "../../common/decorators";
import { MerchantCategoryService } from "./merchant-category.service";
import { ZodValidationPipe } from "../../common/pipes";
import { MerchantGuard, PermissionGuard } from "../../common/guards";
import { CheckOwnershipGuard, ResourceType } from "../../common/guards/check-ownership.guard";

@Controller("merchant-categories")
@UseGuards(PermissionGuard)
export class MerchantCategoryController {
  constructor(private services: MerchantCategoryService) {}

  @Get()
  async getAllCategories(): Promise<MerchantMenuCategory[]> {
    return await this.services.getAllCategory();
  }

  @Get(':id')
  async getById(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<MerchantMenuCategory> {
    return await this.services.getById(id);
  }

  @Post()
  @UseFilters(BadRequestError)
  @UseGuards(MerchantGuard)
  @Roles(["ADMIN", "MERCHANT"])
  async createCategory(
    @Body(new ZodValidationPipe(CreateMenuCategorySchema)) body: CreateCategory,
    @CurrentUser() user: User,
    @CurrentMerchant() merchant: Merchant
  ): Promise<MerchantMenuCategory> {
    return this.services.createCategory(body, user, merchant);
  }

  @Put(':id')
  @UseFilters(BadRequestError)
  @UseGuards(MerchantGuard, CheckOwnershipGuard)
  @Roles(["ADMIN", "MERCHANT"])
  @ResourceType({ resourceType: "category" })
  async updateCategory(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateMenuCategorySchema)) body: UpdateCategory,
    @CurrentMerchant() merchant: Merchant
  ): Promise<MerchantMenuCategory> {
    return await this.services.updateCategory(id, body, merchant)
  }

  @Delete(":id")
  @UseGuards(MerchantGuard, CheckOwnershipGuard)
  @Roles(["ADMIN", "MERCHANT"])
  @ResourceType({ resourceType: "category" })
  async deleteCategory(
    @Param("id", ParseUUIDPipe) id: string
  ) {
    return await this.services.deleteCategory(id)
  }

  
}
