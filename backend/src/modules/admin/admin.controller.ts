import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { PermissionGuard } from "../../common/guards";
import { Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import { UpdateUserStatusSchema } from "./types";
import type {
  AdminUserListResponse,
  DashboardStats,
  UpdateUserStatus,
} from "./types";
import type { Merchant, User } from "@prisma/client";

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
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<AdminUserListResponse> {
    return await this.service.getAllUsers(page, limit);
  }

  @Patch("users/:id/status")
  @Roles(["ADMIN"])
  async updateUserStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateUserStatusSchema)) body: UpdateUserStatus,
  ): Promise<User> {
    return await this.service.updateUserStatus(id, body);
  }

  @Get("merchants")
  @Roles(["ADMIN"])
  async getAllMerchants(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<AdminUserListResponse> {
    return await this.service.getAllMerchants(page, limit);
  }

  @Patch("merchants/:id/verify")
  @Roles(["ADMIN"])
  async verifyMerchant(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<Merchant> {
    return await this.service.verifyMerchant(id);
  }

  @Get("orders")
  @Roles(["ADMIN"])
  async getAllOrders(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<AdminUserListResponse> {
    return await this.service.getAllOrders(page, limit);
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
}
