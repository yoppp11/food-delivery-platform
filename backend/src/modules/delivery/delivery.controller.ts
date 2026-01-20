import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { PermissionGuard } from "../../common/guards";
import { CurrentUser, Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import { AssignDriverSchema } from "./types";
import type { AssignDriver, DeliveryDetails, TrackingInfo } from "./types";
import type { Delivery, User } from "@prisma/client";

@Controller("deliveries")
export class DeliveryController {
  constructor(private readonly service: DeliveryService) {}

  @Get(":orderId")
  async getDeliveryByOrderId(
    @Param("orderId", ParseUUIDPipe) orderId: string,
  ): Promise<DeliveryDetails | null> {
    return await this.service.getDeliveryByOrderId(orderId);
  }

  @Get(":orderId/track")
  async getTrackingInfo(
    @Param("orderId", ParseUUIDPipe) orderId: string,
  ): Promise<TrackingInfo> {
    return await this.service.getTrackingInfo(orderId);
  }

  @Post(":orderId/assign")
  @UseGuards(PermissionGuard)
  @Roles(["MERCHANT", "ADMIN"])
  async assignDriver(
    @Param("orderId", ParseUUIDPipe) orderId: string,
    @Body(new ZodValidationPipe(AssignDriverSchema)) body: AssignDriver,
  ): Promise<Delivery> {
    return await this.service.assignDriver(orderId, body);
  }

  @Patch(":orderId/pickup")
  @UseGuards(PermissionGuard)
  @Roles(["DRIVER", "ADMIN"])
  async markAsPickedUp(
    @Param("orderId", ParseUUIDPipe) orderId: string,
    @CurrentUser() user: User,
  ): Promise<Delivery> {
    return await this.service.markAsPickedUp(orderId, user);
  }

  @Patch(":orderId/complete")
  @UseGuards(PermissionGuard)
  @Roles(["DRIVER", "ADMIN"])
  async markAsCompleted(
    @Param("orderId", ParseUUIDPipe) orderId: string,
    @CurrentUser() user: User,
  ): Promise<Delivery> {
    return await this.service.markAsCompleted(orderId, user);
  }
}

@Controller("drivers/deliveries")
@UseGuards(PermissionGuard)
export class DriverDeliveryController {
  constructor(private readonly service: DeliveryService) {}

  @Get()
  @Roles(["DRIVER"])
  async getDriverDeliveryHistory(
    @CurrentUser() user: User,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return await this.service.getDriverDeliveryHistory(user, page, limit);
  }
}
