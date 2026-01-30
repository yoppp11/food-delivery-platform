import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CurrentUser, Roles } from "../../common/decorators";
import { PermissionGuard } from "../../common/guards";
import { Order, type User } from "@prisma/client";

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
