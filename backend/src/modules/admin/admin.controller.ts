/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { PermissionGuard } from "../../common/guards";
import { Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import {
  UpdateUserStatusSchema,
  CreatePromotionSchema,
  UpdatePromotionSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from "./types";
import type {
  AdminUserListResponse,
  DashboardStats,
  UpdateUserStatus,
  CreatePromotion,
  UpdatePromotion,
  CreateCategory,
  UpdateCategory,
} from "./types";
import type { Merchant, User, Promotion, Category, Role } from "@prisma/client";

@Controller("admin")
@UseGuards(PermissionGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get("dashboard")
  @Roles(["ADMIN"])
  async getDashboardStats(): Promise<DashboardStats> {
    return await this.service.getDashboardStats();
  }

  @Get("users")
  @Roles(["ADMIN"])
  async getAllUsers(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("search") search?: string,
    @Query("role") role?: string,
    @Query("status") status?: string,
  ): Promise<AdminUserListResponse> {
    return await this.service.getAllUsers(page, limit, search, role, status);
  }

  @Get("users/:id")
  @Roles(["ADMIN"])
  async getUser(@Param("id", ParseUUIDPipe) id: string): Promise<User> {
    return await this.service.getUser(id);
  }

  @Patch("users/:id/status")
  @Roles(["ADMIN"])
  async updateUserStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateUserStatusSchema)) body: UpdateUserStatus,
  ): Promise<User> {
    return await this.service.updateUserStatus(id, body);
  }

  @Patch("users/:id/role")
  @Roles(["ADMIN"])
  async updateUserRole(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("role") role: Role,
  ): Promise<User> {
    return await this.service.updateUserRole(id, role);
  }

  @Get("merchants")
  @Roles(["ADMIN"])
  async getAllMerchants(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("search") search?: string,
    @Query("isOpen") isOpen?: string,
  ): Promise<AdminUserListResponse> {
    return await this.service.getAllMerchants(
      page,
      limit,
      search,
      isOpen === "true" ? true : isOpen === "false" ? false : undefined,
    );
  }

  @Get("merchants/:id")
  @Roles(["ADMIN"])
  async getMerchant(@Param("id", ParseUUIDPipe) id: string): Promise<Merchant> {
    return await this.service.getMerchant(id);
  }

  @Patch("merchants/:id/verify")
  @Roles(["ADMIN"])
  async verifyMerchant(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<Merchant> {
    return await this.service.verifyMerchant(id);
  }

  @Get("drivers")
  @Roles(["ADMIN"])
  async getAllDrivers(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("search") search?: string,
    @Query("isAvailable") isAvailable?: string,
  ): Promise<AdminUserListResponse> {
    return await this.service.getAllDrivers(
      page,
      limit,
      search,
      isAvailable === "true"
        ? true
        : isAvailable === "false"
          ? false
          : undefined,
    );
  }

  @Get("orders")
  @Roles(["ADMIN"])
  async getAllOrders(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("paymentStatus") paymentStatus?: string,
  ): Promise<AdminUserListResponse> {
    return await this.service.getAllOrders(
      page,
      limit,
      search,
      status,
      paymentStatus,
    );
  }

  @Get("orders/:id")
  @Roles(["ADMIN"])
  async getOrder(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getOrder(id);
  }

  @Get("reports")
  @Roles(["ADMIN"])
  async getReports(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return await this.service.getReports(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get("promotions")
  @Roles(["ADMIN"])
  async getAllPromotions(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("search") search?: string,
  ) {
    return await this.service.getAllPromotions(page, limit, search);
  }

  @Post("promotions")
  @Roles(["ADMIN"])
  async createPromotion(
    @Body(new ZodValidationPipe(CreatePromotionSchema)) body: CreatePromotion,
  ): Promise<Promotion> {
    return await this.service.createPromotion(body);
  }

  @Patch("promotions/:id")
  @Roles(["ADMIN"])
  async updatePromotion(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdatePromotionSchema)) body: UpdatePromotion,
  ): Promise<Promotion> {
    return await this.service.updatePromotion(id, body);
  }

  @Delete("promotions/:id")
  @Roles(["ADMIN"])
  async deletePromotion(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return await this.service.deletePromotion(id);
  }

  @Get("categories")
  @Roles(["ADMIN"])
  async getAllCategories(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("search") search?: string,
  ) {
    return await this.service.getAllCategories(page, limit, search);
  }

  @Post("categories")
  @Roles(["ADMIN"])
  async createCategory(
    @Body(new ZodValidationPipe(CreateCategorySchema)) body: CreateCategory,
  ): Promise<Category> {
    return await this.service.createCategory(body);
  }

  @Patch("categories/:id")
  @Roles(["ADMIN"])
  async updateCategory(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateCategorySchema)) body: UpdateCategory,
  ): Promise<Category> {
    return await this.service.updateCategory(id, body);
  }

  @Delete("categories/:id")
  @Roles(["ADMIN"])
  async deleteCategory(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return await this.service.deleteCategory(id);
  }
}
