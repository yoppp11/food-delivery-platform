import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CurrentUser, Roles } from "../../common/decorators";
import { PermissionGuard } from "../../common/guards";
import { Order, type User } from "@prisma/client";

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
