import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import type { Cart, CartItem, User } from "@prisma/client";
import { CreateCart, DeleteType, EditType } from "./types";

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAll(userId: string): Promise<Cart[]> {

    return this.prisma.cart.findMany({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        merchant: {
          select: {
            id: true,
            name: true,
            description: true,
            isOpen: true,
            rating: true,
          },
        },
        cartItems: {
          include: {
            menuVariant: {
              include: {
                menu: {
                  include: {
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });
  }

  async postCart(body: CreateCart, user: User): Promise<Cart> {
    const existingCart = await this.findUserCart(user.id);

    if (existingCart && existingCart.merchantId !== body.merchantId) {
      await this.deleteCart(existingCart.id);
      return this.createCart(body, user.id);
    }

    if (existingCart) {
      return this.updateCart(existingCart, body);
    }

    return this.createCart(body, user.id);
  }

  async editQuantity(
    cartItemId: string,
    type: EditType,
    quantity: number,
  ): Promise<CartItem> {
    if (quantity < 1) {
      throw new HttpException(
        "Quantity must be at least 1",
        HttpStatus.BAD_REQUEST,
      );
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new HttpException("Cart item not found", HttpStatus.NOT_FOUND);
    }

    const newQuantity =
      type === "DECREMENT"
        ? Math.max(1, cartItem.quantity - 1)
        : cartItem.quantity + 1;

    return this.prisma.$transaction(async (tx) => {
      const updatedItem = await tx.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity: newQuantity,
          itemTotal: cartItem.basePrice * newQuantity,
        },
      });

      // Recalculate cart subtotal
      const allCartItems = await tx.cartItem.findMany({
        where: { cartId: cartItem.cartId },
      });

      const subtotal = allCartItems.reduce(
        (acc, item) => acc + item.basePrice * item.quantity,
        0,
      );

      await tx.cart.update({
        where: { id: cartItem.cartId },
        data: { subtotal },
      });

      return updatedItem;
    });
  }

  private async findUserCart(
    userId: string,
  ): Promise<(Cart & { cartItems: CartItem[] }) | null> {
    return this.prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { cartItems: true },
    });
  }

  async clearCart(id: string, type: DeleteType): Promise<Cart | CartItem> {
    if (!id) {
      throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);
    }

    if (type === "ALL") {
      return this.deleteCart(id);
    }

    return this.deleteCartItem(id);
  }

  async deleteCart(cartId: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new HttpException("Cart not found", HttpStatus.NOT_FOUND);
    }

    // Delete cart items first, then cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });

    return this.prisma.cart.delete({
      where: { id: cartId },
    });
  }

  async deleteCartItem(cartItemId: string): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new HttpException("Cart item not found", HttpStatus.NOT_FOUND);
    }

    return this.prisma.$transaction(async (tx) => {
      const deletedItem = await tx.cartItem.delete({
        where: { id: cartItemId },
      });

      // Recalculate cart subtotal
      const remainingCartItems = await tx.cartItem.findMany({
        where: { cartId: cartItem.cartId },
      });

      const subtotal = remainingCartItems.reduce(
        (acc, item) => acc + item.basePrice * item.quantity,
        0,
      );

      await tx.cart.update({
        where: { id: cartItem.cartId },
        data: { subtotal },
      });

      return deletedItem;
    });
  }

  private async updateCart(
    existingCart: Cart & { cartItems: CartItem[] },
    body: CreateCart,
  ): Promise<Cart> {
    const existingItemsMap = new Map(
      existingCart.cartItems.map((item) => [item.variantId, item]),
    );

    return this.prisma.$transaction(async (tx) => {
      for (const newItem of body.items) {
        const existingItem = existingItemsMap.get(newItem.variantId);

        if (existingItem) {
          const newQuantity = existingItem.quantity + newItem.quantity;
          const newItemTotal = newItem.basePrice * newQuantity;

          await tx.cartItem.updateMany({
            where: { cartId: existingCart.id, variantId: newItem.variantId },
            data: {
              quantity: newQuantity,
              itemTotal: newItemTotal,
            },
          });
        } else {
          await tx.cartItem.create({
            data: {
              basePrice: newItem.basePrice,
              menuName: newItem.menuName,
              variantId: newItem.variantId,
              cartId: existingCart.id,
              notes: newItem.notes ?? "",
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
        (acc, item) => acc + item.basePrice * item.quantity,
        0,
      );

      this.logger.info(subtotal);

      return tx.cart.update({
        where: { id: existingCart.id },
        data: { subtotal },
        include: { cartItems: true },
      });
    });
  }

  private async createCartItems(
    tx: Parameters<Parameters<typeof this.prisma.$transaction>[0]>[0],
    items: CreateCart["items"],
    cartId: string,
  ): Promise<{ count: number }> {
    const cartItems = items.map((item) => ({
      cartId,
      basePrice: item.basePrice,
      variantId: item.variantId,
      menuName: item.menuName,
      quantity: item.quantity || 1,
      itemTotal: item.basePrice * (item.quantity || 1),
      notes: item.notes ?? "",
    }));

    return tx.cartItem.createMany({ data: cartItems });
  }

  private async createCart(body: CreateCart, userId: string): Promise<Cart> {
    const subtotal = body.items.reduce(
      (acc, item) => acc + item.basePrice * (item.quantity || 1),
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.create({
        data: {
          subtotal,
          merchantId: body.merchantId,
          userId,
          notes: body.notes ?? "",
          status: "ACTIVE",
        },
      });

      await this.createCartItems(tx, body.items, cart.id);

      return tx.cart.findFirstOrThrow({
        where: { id: cart.id },
        include: { cartItems: true },
      });
    });
  }
}
