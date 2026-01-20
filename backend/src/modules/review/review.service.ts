import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { DriverReview, MerchantReview, User } from "@prisma/client";
import {
  CreateDriverReview,
  CreateMerchantReview,
  ReviewListResponse,
  UpdateDriverReview,
  UpdateMerchantReview,
} from "./types";

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMerchantReviews(
    merchantId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ReviewListResponse> {
    try {
      if (!merchantId)
        throw new HttpException(
          "Merchant ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const merchant = await this.prisma.merchant.findUnique({
        where: { id: merchantId },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      const skip = (page - 1) * limit;

      const [reviews, total] = await this.prisma.$transaction([
        this.prisma.merchantReview.findMany({
          where: { merchantId },
          include: {
            user: {
              select: {
                id: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.merchantReview.count({ where: { merchantId } }),
      ]);

      return {
        data: reviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createMerchantReview(
    merchantId: string,
    body: CreateMerchantReview,
    user: User,
  ): Promise<MerchantReview> {
    try {
      if (!merchantId)
        throw new HttpException(
          "Merchant ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const merchant = await this.prisma.merchant.findUnique({
        where: { id: merchantId },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      const completedOrder = await this.prisma.order.findFirst({
        where: {
          userId: user.id,
          merchantId,
          status: "COMPLETED",
        },
      });

      if (!completedOrder)
        throw new HttpException(
          "You can only review merchants you have ordered from",
          HttpStatus.BAD_REQUEST,
        );

      const existingReview = await this.prisma.merchantReview.findFirst({
        where: { userId: user.id, merchantId },
      });

      if (existingReview)
        throw new HttpException(
          "You have already reviewed this merchant",
          HttpStatus.BAD_REQUEST,
        );

      const review = await this.prisma.merchantReview.create({
        data: {
          userId: user.id,
          merchantId,
          rating: body.rating,
          comment: body.comment || "",
        },
      });

      await this.updateMerchantRating(merchantId);

      return review;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateMerchantReview(
    reviewId: string,
    body: UpdateMerchantReview,
    user: User,
  ): Promise<MerchantReview> {
    try {
      if (!reviewId)
        throw new HttpException(
          "Review ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const review = await this.prisma.merchantReview.findUnique({
        where: { id: reviewId },
      });

      if (!review)
        throw new HttpException("Review not found", HttpStatus.NOT_FOUND);

      if (review.userId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      const updated = await this.prisma.merchantReview.update({
        where: { id: reviewId },
        data: body,
      });

      await this.updateMerchantRating(review.merchantId);

      return updated;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteMerchantReview(
    reviewId: string,
    user: User,
  ): Promise<MerchantReview> {
    try {
      if (!reviewId)
        throw new HttpException(
          "Review ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const review = await this.prisma.merchantReview.findUnique({
        where: { id: reviewId },
      });

      if (!review)
        throw new HttpException("Review not found", HttpStatus.NOT_FOUND);

      if (review.userId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      const deleted = await this.prisma.merchantReview.delete({
        where: { id: reviewId },
      });

      await this.updateMerchantRating(review.merchantId);

      return deleted;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async updateMerchantRating(merchantId: string): Promise<void> {
    const reviews = await this.prisma.merchantReview.findMany({
      where: { merchantId },
    });

    if (reviews.length === 0) {
      await this.prisma.merchant.update({
        where: { id: merchantId },
        data: { rating: null },
      });
      return;
    }

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.merchant.update({
      where: { id: merchantId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });
  }

  async getDriverReviews(
    driverId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ReviewListResponse> {
    try {
      if (!driverId)
        throw new HttpException(
          "Driver ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const driver = await this.prisma.driver.findUnique({
        where: { id: driverId },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const skip = (page - 1) * limit;

      const [reviews, total] = await this.prisma.$transaction([
        this.prisma.driverReview.findMany({
          where: { driverId },
          include: {
            user: {
              select: {
                id: true,
                image: true,
              },
            },
          },
          take: limit,
          skip,
        }),
        this.prisma.driverReview.count({ where: { driverId } }),
      ]);

      return {
        data: reviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createDriverReview(
    driverId: string,
    body: CreateDriverReview,
    user: User,
  ): Promise<DriverReview> {
    try {
      if (!driverId)
        throw new HttpException(
          "Driver ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const driver = await this.prisma.driver.findUnique({
        where: { id: driverId },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const completedDelivery = await this.prisma.order.findFirst({
        where: {
          userId: user.id,
          driverId,
          status: "COMPLETED",
        },
      });

      if (!completedDelivery)
        throw new HttpException(
          "You can only review drivers who have delivered to you",
          HttpStatus.BAD_REQUEST,
        );

      const existingReview = await this.prisma.driverReview.findFirst({
        where: { userId: user.id, driverId },
      });

      if (existingReview)
        throw new HttpException(
          "You have already reviewed this driver",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.driverReview.create({
        data: {
          userId: user.id,
          driverId,
          rating: body.rating,
          comment: body.comment || "",
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateDriverReview(
    reviewId: string,
    body: UpdateDriverReview,
    user: User,
  ): Promise<DriverReview> {
    try {
      if (!reviewId)
        throw new HttpException(
          "Review ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const review = await this.prisma.driverReview.findUnique({
        where: { id: reviewId },
      });

      if (!review)
        throw new HttpException("Review not found", HttpStatus.NOT_FOUND);

      if (review.userId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      return await this.prisma.driverReview.update({
        where: { id: reviewId },
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteDriverReview(
    reviewId: string,
    user: User,
  ): Promise<DriverReview> {
    try {
      if (!reviewId)
        throw new HttpException(
          "Review ID is required",
          HttpStatus.BAD_REQUEST,
        );

      const review = await this.prisma.driverReview.findUnique({
        where: { id: reviewId },
      });

      if (!review)
        throw new HttpException("Review not found", HttpStatus.NOT_FOUND);

      if (review.userId !== user.id && user.role !== "ADMIN")
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      return await this.prisma.driverReview.delete({
        where: { id: reviewId },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
