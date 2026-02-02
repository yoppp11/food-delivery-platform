import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { PermissionGuard } from "../../common/guards";
import { CurrentUser, Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import {
  CreateDriverReviewSchema,
  CreateMerchantReviewSchema,
  UpdateDriverReviewSchema,
  UpdateMerchantReviewSchema,
} from "./types";
import type {
  CreateDriverReview,
  CreateMerchantReview,
  OrderReviewStatus,
  ReviewListResponse,
  UpdateDriverReview,
  UpdateMerchantReview,
} from "./types";
import type { DriverReview, MerchantReview, User } from "@prisma/client";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Get("orders/:orderId/status")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER"])
  async getOrderReviewStatus(
    @Param("orderId", ParseUUIDPipe) orderId: string,
    @CurrentUser() user: User,
  ): Promise<OrderReviewStatus> {
    return await this.service.getOrderReviewStatus(orderId, user);
  }

  @Get("merchants/:merchantId")
  async getMerchantReviews(
    @Param("merchantId", ParseUUIDPipe) merchantId: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<ReviewListResponse> {
    return await this.service.getMerchantReviews(merchantId, page, limit);
  }

  @Post("merchants/:merchantId")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER"])
  async createMerchantReview(
    @Param("merchantId", ParseUUIDPipe) merchantId: string,
    @Body(new ZodValidationPipe(CreateMerchantReviewSchema))
    body: CreateMerchantReview,
    @CurrentUser() user: User,
  ): Promise<MerchantReview> {
    return await this.service.createMerchantReview(merchantId, body, user);
  }

  @Put("merchants/:reviewId")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER", "ADMIN"])
  async updateMerchantReview(
    @Param("reviewId", ParseUUIDPipe) reviewId: string,
    @Body(new ZodValidationPipe(UpdateMerchantReviewSchema))
    body: UpdateMerchantReview,
    @CurrentUser() user: User,
  ): Promise<MerchantReview> {
    return await this.service.updateMerchantReview(reviewId, body, user);
  }

  @Delete("merchants/:reviewId")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER", "ADMIN"])
  async deleteMerchantReview(
    @Param("reviewId", ParseUUIDPipe) reviewId: string,
    @CurrentUser() user: User,
  ): Promise<MerchantReview> {
    return await this.service.deleteMerchantReview(reviewId, user);
  }

  @Get("drivers/:driverId")
  async getDriverReviews(
    @Param("driverId", ParseUUIDPipe) driverId: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<ReviewListResponse> {
    return await this.service.getDriverReviews(
      driverId,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Post("drivers/:driverId")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER"])
  async createDriverReview(
    @Param("driverId", ParseUUIDPipe) driverId: string,
    @Body(new ZodValidationPipe(CreateDriverReviewSchema))
    body: CreateDriverReview,
    @CurrentUser() user: User,
  ): Promise<DriverReview> {
    return await this.service.createDriverReview(driverId, body, user);
  }

  @Put("drivers/:reviewId")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER", "ADMIN"])
  async updateDriverReview(
    @Param("reviewId", ParseUUIDPipe) reviewId: string,
    @Body(new ZodValidationPipe(UpdateDriverReviewSchema))
    body: UpdateDriverReview,
    @CurrentUser() user: User,
  ): Promise<DriverReview> {
    return await this.service.updateDriverReview(reviewId, body, user);
  }

  @Delete("drivers/:reviewId")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER", "ADMIN"])
  async deleteDriverReview(
    @Param("reviewId", ParseUUIDPipe) reviewId: string,
    @CurrentUser() user: User,
  ): Promise<DriverReview> {
    return await this.service.deleteDriverReview(reviewId, user);
  }
}
