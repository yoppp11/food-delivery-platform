import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Order, User } from "@prisma/client";
import { CreateOrder } from "./types";

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
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
      const order = await this.prisma.order.create({
        data: {
          userId: user.id,
          totalPrice: body.totalPrice,
          merchantId: body.merchantId,
        },
      });

      const newOrderItems = body.items.map((item) => ({
        orderId: order.id,
        menuId: item.menuId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      }));

      await this.prisma.orderItem.createMany({ data: newOrderItems });

      return order;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
