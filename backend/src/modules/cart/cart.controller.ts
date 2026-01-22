import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CurrentUser, Roles } from "../../common/decorators";
import type { Cart, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PermissionGuard } from "../../common/guards";
import { ZodValidationPipe } from "../../common/pipes";
import {
  type CreateCart,
  CreateCartSchema,
  type DeleteType,
  type EditType,
} from "./types";
import { BadRequestError } from "../../common/exception.filter";

@Controller("carts")
@UseGuards(PermissionGuard)
export class CartController {
  constructor(
    private readonly service: CartService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  @Roles(["CUSTOMER"])
  async getAll(@CurrentUser() user: User): Promise<Cart[]> {
    return this.service.getAll(user.id);
  }

  @Post()
  @UseFilters(BadRequestError)
  @Roles(["CUSTOMER"])
  async createCart(
    @Body(new ZodValidationPipe(CreateCartSchema)) body: CreateCart,
    @CurrentUser() user: User,
  ) {
    return this.service.postCart(body, user);
  }

  @Delete(":id")
  @Roles(["CUSTOMER"])
  async deleteCart(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("type") type: DeleteType,
  ) {
    return this.service.clearCart(id, type);
  }

  @Patch(":id")
  @Roles(["CUSTOMER"])
  async editQuantity(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("type") type: EditType,
    @Body("quantity") quantity: number,
  ) {
    return await this.service.editQuantity(id, type, quantity);
  }
}
