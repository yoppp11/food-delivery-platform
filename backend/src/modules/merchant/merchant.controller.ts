/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MerchantService } from "./merchant.service";
import type { CreateMerchantRequest } from "../../schemas/merchant";
import type { Merchant, MerchantOperationalHour, User } from "@prisma/client";
import { PermissionGuard } from "../../common/guards";
import { CurrentUser, Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import {
  CreateOperationalHourSchema,
  GetMerchantsQuerySchema,
  RegisterMerchantSchema,
  UpdateMerchantSchema,
  UpdateOperationalHourSchema,
} from "./types";
import type {
  CreateOperationalHour,
  GetMerchantsQuery,
  MerchantListResponse,
  RegisterMerchant,
  UpdateMerchant,
  UpdateOperationalHour,
} from "./types";

@Controller("merchants")
export class MerchantController {
  constructor(private service: MerchantService) {}

  @Get("me")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT"])
  async getCurrentMerchant(@CurrentUser() user: User) {
    return await this.service.getMerchantByOwnerId(user.id);
  }

  @Get("my-merchants")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT"])
  async getMyMerchants(@CurrentUser() user: User) {
    return await this.service.getMerchantsByOwnerId(user.id);
  }

  @Get()
  async getAllMerchants(
    @Query(new ZodValidationPipe(GetMerchantsQuerySchema))
    query: GetMerchantsQuery,
  ): Promise<MerchantListResponse> {
    return await this.service.getAllMerchants(query);
  }

  @Get("featured")
  async getFeaturedMerchants(
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return await this.service.getFeaturedMerchants(limit);
  }

  @Get("nearby")
  async getNearbyMerchants(
    @Query("lat") lat: string,
    @Query("lng") lng: string,
    @Query("maxDistance") maxDistance?: string,
  ) {
    return await this.service.getNearbyMerchants(
      parseFloat(lat),
      parseFloat(lng),
      maxDistance ? parseFloat(maxDistance) : undefined,
    );
  }

  @Get(":id")
  async getMerchantById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getMerchantById(id);
  }

  @Get(":id/menus")
  async getMerchantMenus(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getMerchantMenus(id);
  }

  @Get(":id/reviews")
  async getMerchantReviews(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return await this.service.getMerchantReviews(
      id,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get(":id/operational-hours")
  async getOperationalHours(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<MerchantOperationalHour[]> {
    return await this.service.getOperationalHours(id);
  }

  @Post()
  async createMerchant(@Body() body: CreateMerchantRequest): Promise<Merchant> {
    return await this.service.createTenant(body);
  }

  @Post(":id/operational-hours")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT", "ADMIN"])
  async createOperationalHour(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(CreateOperationalHourSchema))
    body: CreateOperationalHour,
    @CurrentUser() user: User,
  ): Promise<MerchantOperationalHour> {
    return await this.service.createOperationalHour(id, body, user);
  }

  @Put(":id")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT", "ADMIN"])
  async updateMerchant(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateMerchantSchema)) body: UpdateMerchant,
    @CurrentUser() user: User,
  ): Promise<Merchant> {
    return await this.service.updateMerchant(id, body, user);
  }

  @Put(":id/operational-hours/:hourId")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT", "ADMIN"])
  async updateOperationalHour(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("hourId", ParseUUIDPipe) hourId: string,
    @Body(new ZodValidationPipe(UpdateOperationalHourSchema))
    body: UpdateOperationalHour,
    @CurrentUser() user: User,
  ): Promise<MerchantOperationalHour> {
    return await this.service.updateOperationalHour(id, hourId, body, user);
  }

  @Patch(":id/toggle-status")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT", "ADMIN"])
  async toggleStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Merchant> {
    return await this.service.toggleStatus(id, user);
  }

  @Delete(":id")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT", "ADMIN"])
  async deleteMerchant(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Merchant> {
    return await this.service.deleteMerchant(id, user);
  }

  @Delete(":id/operational-hours/:hourId")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT", "ADMIN"])
  async deleteOperationalHour(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("hourId", ParseUUIDPipe) hourId: string,
    @CurrentUser() user: User,
  ): Promise<MerchantOperationalHour> {
    return await this.service.deleteOperationalHour(id, hourId, user);
  }

  @Post("register")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER"])
  async registerMerchant(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(RegisterMerchantSchema)) body: RegisterMerchant,
  ): Promise<Merchant> {
    return await this.service.registerMerchant(user, body);
  }

  @Get("admin/pending")
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async getPendingMerchants() {
    return await this.service.getPendingMerchants();
  }

  @Patch(":id/approve")
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async approveMerchant(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.approveMerchant(id);
  }

  @Patch(":id/reject")
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async rejectMerchant(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.rejectMerchant(id);
  }
}
