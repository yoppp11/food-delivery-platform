/* eslint-disable prettier/prettier */
import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CurrentUser, Roles } from "../../common/decorators";
import type { Cart, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PermissionGuard } from "../../common/guards";

@Controller("carts")
@UseGuards(PermissionGuard)
export class CartController {
  constructor(
    private readonly service: CartService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Get()
  @Roles(["CUSTOMER"])
  async getAll(@CurrentUser() user: User): Promise<Cart[]> {
    this.logger.info("service cart");
    return this.service.getAll(user.id);
  }
}
