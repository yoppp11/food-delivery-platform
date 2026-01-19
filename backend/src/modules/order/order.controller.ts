import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
  async getById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getById(id);
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
