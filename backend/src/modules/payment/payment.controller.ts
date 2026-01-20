import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CurrentUser, Roles } from "../../common/decorators";
import { Merchant, Order, OrderItem, Payment, type User } from "@prisma/client";
import { ZodValidationPipe } from "../../common/pipes";
import { type CreatePayment, CreatePaymentSchema } from "./types";
import { PermissionGuard } from "../../common/guards";

@Controller("payments")
@UseGuards(PermissionGuard)
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get()
  @Roles(["ADMIN", "CUSTOMER", "MERCHANT"])
  async getPayments(
    @CurrentUser() user: User,
  ): Promise<(Payment & { order: Order & { items: OrderItem[] } })[]> {
    return await this.service.getPayments(user);
  }

  @Get(":id")
  @Roles(["ADMIN", "MERCHANT", "CUSTOMER"])
  async getPaymentById(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<
    Payment & {
      customer: User;
      merchant: Merchant;
      order: Order & { items: OrderItem[] };
    }
  > {
    return await this.service.getPaymentById(id, user);
  }

  @Post(":id")
  @Roles(["CUSTOMER", "ADMIN"])
  async createPayment(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(CreatePaymentSchema)) body: CreatePayment,
    @CurrentUser() user: User,
  ) {
    return await this.service.createPayment(id, body, user);
  }

  @Post(":id/success")
  @Roles(["ADMIN", "MERCHANT", "CUSTOMER"])
  async paymentSuccess(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.service.paymentSuccess(id, user);
  }

  @Post(":id/cancelled")
  @Roles(["ADMIN", "CUSTOMER", "MERCHANT"])
  async cancelPayment(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.service.cancelPayment(id, user);
  }
}
