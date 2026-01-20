import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { DiscountType, OrderPromotion, Promotion } from "@prisma/client";
import {
  ApplyPromo,
  CreatePromotion,
  UpdatePromotion,
  ValidatePromo,
  ValidatePromoResponse,
} from "./types";

@Injectable()
export class PromotionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAllPromotions(): Promise<Promotion[]> {
    try {
      return await this.prisma.promotion.findMany({
        where: {
          expiredAt: { gt: new Date() },
        },
        orderBy: { expiredAt: "asc" },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPromotionById(id: string): Promise<Promotion> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const promotion = await this.prisma.promotion.findUnique({
        where: { id },
      });

      if (!promotion)
        throw new HttpException("Promotion not found", HttpStatus.NOT_FOUND);

      return promotion;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private calculateDiscount(
    orderTotal: number,
    discountType: DiscountType,
    discountValue: number,
    maxDiscount: number,
  ): number {
    let discount = 0;

    if (discountType === DiscountType.PERCENT) {
      discount = (orderTotal * discountValue) / 100;
    } else {
      discount = discountValue;
    }

    return Math.min(discount, maxDiscount);
  }

  async validatePromo(body: ValidatePromo): Promise<ValidatePromoResponse> {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { code: body.code },
      });

      if (!promotion) {
        return {
          valid: false,
          message: "Invalid promo code",
        };
      }

      if (new Date(promotion.expiredAt) < new Date()) {
        return {
          valid: false,
          message: "Promo code has expired",
        };
      }

      const discountAmount = this.calculateDiscount(
        body.orderTotal,
        promotion.discountType,
        promotion.discountValue,
        promotion.maxDiscount,
      );

      return {
        valid: true,
        promotion: {
          id: promotion.id,
          code: promotion.code,
          discountType: promotion.discountType,
          discountValue: promotion.discountValue,
          maxDiscount: promotion.maxDiscount,
        },
        discountAmount,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async applyPromo(body: ApplyPromo): Promise<OrderPromotion> {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { code: body.code },
      });

      if (!promotion)
        throw new HttpException("Invalid promo code", HttpStatus.BAD_REQUEST);

      if (new Date(promotion.expiredAt) < new Date())
        throw new HttpException(
          "Promo code has expired",
          HttpStatus.BAD_REQUEST,
        );

      const order = await this.prisma.order.findUnique({
        where: { id: body.orderId },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      const existingPromo = await this.prisma.orderPromotion.findFirst({
        where: { orderId: body.orderId },
      });

      if (existingPromo)
        throw new HttpException(
          "Order already has a promo applied",
          HttpStatus.BAD_REQUEST,
        );

      const discountAmount = this.calculateDiscount(
        order.totalPrice,
        promotion.discountType,
        promotion.discountValue,
        promotion.maxDiscount,
      );

      return await this.prisma.orderPromotion.create({
        data: {
          orderId: body.orderId,
          promotionId: promotion.id,
          discountAmount,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createPromotion(body: CreatePromotion): Promise<Promotion> {
    try {
      const existing = await this.prisma.promotion.findUnique({
        where: { code: body.code },
      });

      if (existing)
        throw new HttpException(
          "Promo code already exists",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.promotion.create({
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updatePromotion(id: string, body: UpdatePromotion): Promise<Promotion> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const promotion = await this.prisma.promotion.findUnique({
        where: { id },
      });

      if (!promotion)
        throw new HttpException("Promotion not found", HttpStatus.NOT_FOUND);

      if (body.code && body.code !== promotion.code) {
        const existing = await this.prisma.promotion.findUnique({
          where: { code: body.code },
        });

        if (existing)
          throw new HttpException(
            "Promo code already exists",
            HttpStatus.BAD_REQUEST,
          );
      }

      return await this.prisma.promotion.update({
        where: { id },
        data: body,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deletePromotion(id: string): Promise<Promotion> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const promotion = await this.prisma.promotion.findUnique({
        where: { id },
      });

      if (!promotion)
        throw new HttpException("Promotion not found", HttpStatus.NOT_FOUND);

      return await this.prisma.promotion.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
