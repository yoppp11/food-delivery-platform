import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CurrentUser, Roles } from "../../common/decorators";
import { PermissionGuard } from "../../common/guards";
import { Order, type User } from "@prisma/client";
import { BadRequestError } from "../../common/exception.filter";
import { ZodValidationPipe } from "../../common/pipes";
import { type CreateOrder, CreateOrderSchema, type OrderStatus } from "./types";
import { OrderOwnerGuard } from "../../common/guards/check-ownership.guard";

@Controller("orders")
@UseGuards(PermissionGuard)
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Get()
  @Roles(["CUSTOMER"])
  async getOrders(@CurrentUser() user: User): Promise<Order[]> {
    return this.service.getOrders(user);
  }

  @Get("active")
  @Roles(["CUSTOMER"])
  async getActiveOrders(@CurrentUser() user: User): Promise<Order[]> {
    return this.service.getActiveOrders(user);
  }

  @Get("history")
  @Roles(["CUSTOMER"])
  async getOrderHistory(
    @CurrentUser() user: User,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.service.getOrderHistory(user, page, limit);
  }

  @Post()
  @UseFilters(BadRequestError)
  @Roles(["CUSTOMER", "ADMIN"])
  async createOrder(
    @Body(new ZodValidationPipe(CreateOrderSchema)) body: CreateOrder,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.service.createOrder(body, user);
  }

  @Get(":id")
  @Roles(["CUSTOMER", "MERCHANT", "ADMIN"])
  async getById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getById(id);
  }

  @Get(":id/track")
  @Roles(["CUSTOMER", "MERCHANT", "ADMIN", "DRIVER"])
  async getOrderTracking(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getOrderTracking(id);
  }

  @Get(":id/status-history")
  @Roles(["CUSTOMER", "MERCHANT", "ADMIN"])
  async getStatusHistory(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getStatusHistory(id);
  }

  @Post(":id/reorder")
  @Roles(["CUSTOMER"])
  async reorder(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return await this.service.reorder(id, user);
  }

  @Patch(":id")
  @UseGuards(OrderOwnerGuard)
  @Roles(["CUSTOMER", "MERCHANT", "ADMIN"])
  async editStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("status") status: OrderStatus,
    @CurrentUser() user: User,
  ) {
    return await this.service.editStatus(id, status, user);
  }

  @Patch(":id/cancelled")
  @UseGuards(OrderOwnerGuard)
  @Roles(["CUSTOMER", "MERCHANT", "ADMIN"])
  async cancelledOrder(@Param("id") id: string, @CurrentUser() user: User) {
    return this.service.cancelledOrder(id, user);
  }
}

@Controller("merchants/orders")
@UseGuards(PermissionGuard)
export class MerchantOrderController {
  constructor(private readonly service: OrderService) {}

  @Get()
  @Roles(["MERCHANT"])
  async getMerchantOrders(
    @CurrentUser() user: User,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.service.getMerchantOrders(
      user,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get("pending")
  @Roles(["MERCHANT"])
  async getMerchantPendingOrders(@CurrentUser() user: User) {
    return this.service.getMerchantPendingOrders(user);
  }

  @Patch(":id/accept")
  @Roles(["MERCHANT"])
  async acceptOrder(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.service.acceptOrder(id, user);
  }

  @Patch(":id/reject")
  @Roles(["MERCHANT"])
  async rejectOrder(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.service.rejectOrder(id, user);
  }
}

@Controller("drivers/orders")
@UseGuards(PermissionGuard)
export class DriverOrderController {
  constructor(private readonly service: OrderService) {}

  @Get("available")
  @Roles(["DRIVER"])
  async getAvailableOrdersForDriver(@CurrentUser() user: User) {
    return this.service.getAvailableOrdersForDriver(user);
  }

  @Post(":id/accept")
  @Roles(["DRIVER"])
  async acceptDelivery(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.service.acceptDelivery(id, user);
  }

  @Patch(":id/pickup")
  @Roles(["DRIVER"])
  async markOrderPickedUp(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.service.markOrderPickedUp(id, user);
  }

  @Patch(":id/deliver")
  @Roles(["DRIVER"])
  async markOrderDelivered(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.service.markOrderDelivered(id, user);
  }
}
