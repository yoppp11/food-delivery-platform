/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import type { Cart, User } from "@prisma/client";
import { CreateCart, DeleteType, EditType } from "./types";

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getAll(id: string): Promise<Cart[]> {
    try {
      this.logger.info("service cart");
      const cart = await this.prisma.cart.findMany({
        where: {
          userId: id,
        },
        include: {
          cartItems: true,
        },
      });

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async postCart(body: CreateCart, user: User): Promise<Cart> {
    try {
      const existingCart = await this.findUserCart(user.id);

      if (existingCart && existingCart.merchantId !== body.merchantId) {
        await this.clearCart(existingCart.id, "ALL");
      }

      if (existingCart) {
        await this.updateCart(existingCart, body);
      }

      return await this.createCart(body, user.id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async editQuantity(id: string, type: EditType, quantity: number) {
    try {
      if (quantity < 1)
        throw new HttpException("Quantity at least 1", HttpStatus.BAD_REQUEST);

      await this.prisma.cartItem.update({
        where: { id },
        data: { quantity: type === "DECREMENT" ? -1 : +1 },
      });

      return "Updated data sucessfully";
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async findUserCart(userId: string) {
    return this.prisma.cart.findFirst({
      where: { id: userId },
      include: { cartItems: true },
    });
  }

  clearCart(cartId: string, type: DeleteType) {
    try {
      if (!cartId)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      if (type === "ALL") {
        return this.prisma.cart.delete({
          where: { id: cartId },
        });
      } else {
        return this.prisma.cartItem.delete({
          where: { id: cartId },
        });
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  clearPartialCartItem(cartItemId: string) {
    try {
      if (!cartItemId)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      return this.prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async updateCart(
    existingCart: Cart & { cartItems: { menuId: string; quantity: number }[] },
    body: CreateCart
  ) {
    const existingItemsMap = new Map(
      existingCart.cartItems.map((c) => [c.menuId, c])
    );

    await this.prisma.$transaction(async (tx) => {
      for (const newItem of body.items) {
        const existingItem = existingItemsMap.get(newItem.menuId);

        if (existingItem) {
          await tx.cartItem.updateMany({
            where: { cartId: existingCart.id, menuId: newItem.menuId },
            data: {
              quantity: existingItem.quantity + newItem.quantity,
              itemTotal:
                newItem.basePrice * (existingItem.quantity * newItem.quantity),
            },
          });
        } else {
          await tx.cartItem.create({
            data: {
              basePrice: newItem.basePrice,
              menuName: newItem.menuName,
              menuId: newItem.menuId,
              cartId: existingCart.id,
              notes: body.notes ?? "",
              itemTotal: newItem.basePrice * newItem.quantity,
              quantity: newItem.quantity,
            },
          });
        }
      }

      const updatedItems = await tx.cartItem.findMany({
        where: { cartId: existingCart.id },
      });

      const subtotal = updatedItems.reduce(
        (acc, curr) => acc + curr.basePrice * curr.quantity,
        0
      );

      return await tx.cart.update({
        where: { id: existingCart.id },
        data: { subtotal },
        include: { cartItems: true },
      });
    });
  }

  private async createCartItem(
    tx: Parameters<Parameters<typeof this.prisma.$transaction>[0]>[0],
    items: CreateCart["items"],
    cartId: string
  ) {
    const newItems = items.map((c) => ({
      cartId,
      basePrice: c.basePrice,
      menuId: c.menuId,
      menuName: c.menuName,
      quantity: c.quantity || 1,
      itemTotal: c.basePrice * c.quantity,
      notes: c.notes ?? "",
    }));

    return await tx.cartItem.createMany({ data: newItems });
  }

  private async createCart(body: CreateCart, userId: string): Promise<Cart> {
    const subtotal = body.items.reduce(
      (acc, curr) => acc + curr.basePrice * curr.quantity,
      0
    );

    return await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.create({
        data: {
          subtotal,
          merchantId: body.merchantId,
          userId,
          notes: body.notes ?? "",
          status: "ACTIVE",
        },
      });

      await this.createCartItem(tx, body.items, cart.id);

      return tx.cart.findFirstOrThrow({
        where: { id: cart.id },
        include: { cartItems: true },
      });
    });
  }
}
