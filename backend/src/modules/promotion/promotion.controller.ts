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
import { PromotionService } from "./promotion.service";
import { PermissionGuard } from "../../common/guards";
import { Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import {
  ApplyPromoSchema,
  CreatePromotionSchema,
  UpdatePromotionSchema,
  ValidatePromoSchema,
} from "./types";
import type {
  ApplyPromo,
  CreatePromotion,
  UpdatePromotion,
  ValidatePromo,
  ValidatePromoResponse,
} from "./types";
import type { OrderPromotion, Promotion } from "@prisma/client";

@Controller("promotions")
export class PromotionController {
  constructor(private readonly service: PromotionService) {}

  @Get()
  async getAllPromotions(): Promise<Promotion[]> {
    return await this.service.getAllPromotions();
  }

  @Get("active")
  async getActivePromotions(): Promise<Promotion[]> {
    return await this.service.getAllPromotions();
  }

  @Get(":id")
  async getPromotionById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<Promotion> {
    return await this.service.getPromotionById(id);
  }

  @Post("validate")
  async validatePromo(
    @Body(new ZodValidationPipe(ValidatePromoSchema)) body: ValidatePromo,
  ): Promise<ValidatePromoResponse> {
    return await this.service.validatePromo(body);
  }

  @Post("apply")
  @UseGuards(PermissionGuard)
  @Roles(["CUSTOMER"])
  async applyPromo(
    @Body(new ZodValidationPipe(ApplyPromoSchema)) body: ApplyPromo,
  ): Promise<OrderPromotion> {
    return await this.service.applyPromo(body);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async createPromotion(
    @Body(new ZodValidationPipe(CreatePromotionSchema)) body: CreatePromotion,
  ): Promise<Promotion> {
    return await this.service.createPromotion(body);
  }

  @Put(":id")
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async updatePromotion(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdatePromotionSchema)) body: UpdatePromotion,
  ): Promise<Promotion> {
    return await this.service.updatePromotion(id, body);
  }

  @Delete(":id")
  @UseGuards(PermissionGuard)
  @Roles(["ADMIN"])
  async deletePromotion(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<Promotion> {
    return await this.service.deletePromotion(id);
  }
}
