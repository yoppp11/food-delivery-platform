/* eslint-disable @typescript-eslint/no-for-in-array */
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Menu, Order, User } from "@prisma/client";
import { CreateOrder } from "./types";
import { CartService } from "../cart/cart.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getOrders(user: User): Promise<Order[]> {
    try {
      if (user.role !== "MERCHANT") {
        return await this.prisma.order.findMany({
          where: { userId: user.id },
          include: { items: true },
        });
      } else {
        return await this.prisma.order.findMany({
          where: { merchantId: user.id },
          include: { items: true },
        });
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createOrder(body: CreateOrder, user: User): Promise<Order> {
    try {
      const cart = await this.findUserCart(user.id);

      if (!cart)
        throw new HttpException("Cart not found", HttpStatus.NOT_FOUND);

      const currentMenus: (Menu & { variantId: string; price: number })[] = [];

      for (const m of cart.cartItems) {
        const menu = await this.prisma.menu.findFirst({
          where: { id: m.menuVariant.menuId },
          include: {
            menuVariants: true,
          },
        });

        const variant = await this.prisma.menuVariant.findFirst({
          where: { id: m.variantId },
        });

        if (menu && variant && menu.isAvailable) {
          currentMenus.push({
            ...menu,
            price: variant.price,
            variantId: variant.id,
          });
        }
      }

      const merchant = await this.prisma.merchant.findFirst({
        where: { id: cart.merchantId },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      if (!merchant.isOpen)
        throw new HttpException("Merchant is closed", HttpStatus.BAD_REQUEST);

      return await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            userId: user.id,
            totalPrice: cart.subtotal,
            merchantId: body.merchantId,
          },
        });

        const newOrderItems = cart.cartItems.map((item) => ({
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.basePrice,
        }));

        await tx.orderItem.createMany({ data: newOrderItems });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            changedBy: merchant.id,
            changedAt: new Date(),
          },
        });

        await tx.cart.update({
          where: { id: cart.id },
          data: { status: "CHECKOUT" },
        });

        return order;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private findUserCart(userId: string) {
    return this.prisma.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            menuVariant: {
              include: {
                menu: true,
              },
            },
          },
        },
      },
    });
  }
}
