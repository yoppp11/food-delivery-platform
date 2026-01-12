/* eslint-disable @typescript-eslint/no-for-in-array */
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import {
  CartItem,
  Menu,
  MenuVariant,
  Order,
  OrderStatusFieldHistory,
  User,
} from "@prisma/client";
import { CreateOrder, OrderStatus } from "./types";
import { CartService } from "../cart/cart.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
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

      const variantIds = cart.cartItems.map((data) => data.variantId);

      const variants = await this.prisma.menuVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
        },
        include: {
          menu: true,
        },
      });

      this.validateMenus(cart.cartItems, variants);

      const merchant = await this.prisma.merchant.findFirst({
        where: { id: body.merchantId },
        include: {
          user: true,
        },
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

        this.logger.info(newOrderItems);

        await tx.orderItem.createMany({ data: newOrderItems });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            changedBy: user.id,
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

  async getById(id: string) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const order = await this.prisma.order.findFirst({
        where: { id },
        include: {
          items: {
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

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      return order;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async editStatus(id: string, status: OrderStatus, user: User) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      const ORDER_STATUS_FLOW: Record<string, string[]> = {
        CREATED: ["PAID", "CANCELLED"],
        PAID: ["PREPARING", "CANCELLED"],
        PREPARING: ["READY", "CANCELLED"],
        READY: ["ON_DELIVERY"],
        ON_DELIVERY: ["COMPLETED", "CANCELLED"],
        COMPLETED: [],
        CANCELLED: ["REFUNDED"],
        REFUNDED: [],
      };

      const isAllowed = ORDER_STATUS_FLOW[order.status];

      if (!isAllowed || !isAllowed.includes(status))
        throw new HttpException(
          "You don't have access for this transition",
          HttpStatus.FORBIDDEN,
        );

      return await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { id },
          data: { status },
        });

        await tx.orderStatusHistory.updateMany({
          where: { orderId: id },
          data: {
            status: status as OrderStatusFieldHistory,
            changedAt: new Date(),
            changedBy: user.id,
          },
        });

        return order;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async cancelledOrder(id: string, user: User) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      if (order.status !== "CREATED" && order.status !== "PAID")
        throw new HttpException(
          "Order can't be cancelled",
          HttpStatus.BAD_REQUEST
        );

      return await this.prisma.$transaction(async (tx) => {
        await tx.orderStatusHistory.updateMany({
          where: { orderId: id },
          data: {
            status: "CANCELLED",
            changedAt: new Date(),
            changedBy: user.id,
          },
        });
        return await tx.order.update({
          where: { id },
          data: {
            status: "CANCELLED",
            paymentStatus: order.status === "CREATED" ? "FAILED" : "REFUNDED",
          },
        });
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

  private validateMenus(
    cartItems: CartItem[],
    menuVariants: (MenuVariant & { menu: Menu })[]
  ) {
    for (const item of cartItems) {
      const variant = menuVariants.find((v) => v.id === item.variantId);

      if (!variant)
        throw new HttpException("Menu Variant not found", HttpStatus.NOT_FOUND);
      if (!variant.menu.isAvailable)
        throw new HttpException(
          "Menu is not available",
          HttpStatus.BAD_REQUEST
        );
      if (item.quantity < 1)
        throw new HttpException("Invalid quantity", HttpStatus.BAD_REQUEST);
    }
  }
}
