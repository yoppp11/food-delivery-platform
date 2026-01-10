import {
  Body,
  Controller,
  Get,
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
import { type CreateOrder, CreateOrderSchema } from "./types";

@Controller("orders")
@UseGuards(PermissionGuard)
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Get()
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
}
