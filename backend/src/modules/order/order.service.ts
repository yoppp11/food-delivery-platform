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

      this.logger.info(cart);

      const variantIds = cart.cartItems.map((data) => data.variantId);

      this.logger.info(variantIds);

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

      this.logger.info(variants);

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
          include: {
            items: {
              include: {
                menuVariant: true,
              },
            },
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
          data: { status: "CHECKOUT", orderId: order.id },
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
          HttpStatus.BAD_REQUEST,
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

  async getActiveOrders(user: User): Promise<Order[]> {
    try {
      const activeStatuses = [
        "CREATED",
        "PAID",
        "PREPARING",
        "READY",
        "ON_DELIVERY",
      ] as const;
      return await this.prisma.order.findMany({
        where: {
          userId: user.id,
          status: { in: [...activeStatuses] },
        },
        include: {
          items: {
            include: {
              menuVariant: {
                include: { menu: true },
              },
            },
          },
          merchant: true,
        },
        orderBy: { id: "desc" },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getOrderHistory(user: User, page: number = 1, limit: number = 20) {
    try {
      const completedStatuses = ["COMPLETED", "CANCELLED", "REFUNDED"] as const;
      const skip = (page - 1) * limit;

      const [orders, total] = await this.prisma.$transaction([
        this.prisma.order.findMany({
          where: {
            userId: user.id,
            status: { in: [...completedStatuses] },
          },
          include: {
            items: {
              include: {
                menuVariant: {
                  include: { menu: true },
                },
              },
            },
            merchant: true,
          },
          orderBy: { id: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.order.count({
          where: {
            userId: user.id,
            status: { in: [...completedStatuses] },
          },
        }),
      ]);

      return {
        data: orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getOrderTracking(id: string) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          statusHistories: {
            orderBy: { changedAt: "asc" },
          },
          driver: {
            include: {
              driverLocations: {
                orderBy: { recordedAt: "desc" },
                take: 1,
              },
            },
          },
          merchant: true,
        },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      return {
        orderId: order.id,
        status: order.status,
        statusHistory: order.statusHistories,
        driver: order.driver
          ? {
              id: order.driver.id,
              plateNumber: order.driver.plateNumber,
              location: order.driver.driverLocations[0]
                ? {
                    latitude: Number(order.driver.driverLocations[0].latitude),
                    longitude: Number(
                      order.driver.driverLocations[0].longitude,
                    ),
                  }
                : null,
            }
          : null,
        merchant: {
          id: order.merchant.id,
          name: order.merchant.name,
          latitude: Number(order.merchant.latitude),
          longitude: Number(order.merchant.longitude),
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getStatusHistory(id: string) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      return await this.prisma.orderStatusHistory.findMany({
        where: { orderId: id },
        orderBy: { changedAt: "asc" },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async reorder(id: string, user: User): Promise<Order> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const previousOrder = await this.prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              menuVariant: {
                include: { menu: true },
              },
            },
          },
          merchant: true,
        },
      });

      if (!previousOrder)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      if (previousOrder.userId !== user.id)
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      if (!previousOrder.merchant.isOpen)
        throw new HttpException("Merchant is closed", HttpStatus.BAD_REQUEST);

      return await this.prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId: user.id,
            merchantId: previousOrder.merchantId,
            totalPrice: previousOrder.totalPrice,
          },
        });

        const newItems = previousOrder.items.map((item) => ({
          orderId: newOrder.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        }));

        await tx.orderItem.createMany({ data: newItems });

        await tx.orderStatusHistory.create({
          data: {
            orderId: newOrder.id,
            changedBy: user.id,
            changedAt: new Date(),
          },
        });

        return await tx.order.findUniqueOrThrow({
          where: { id: newOrder.id },
          include: { items: true },
        });
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getMerchantOrders(user: User, page: number = 1, limit: number = 20) {
    try {
      const merchant = await this.prisma.merchant.findFirst({
        where: { ownerId: user.id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      const skip = (page - 1) * limit;

      const [orders, total] = await this.prisma.$transaction([
        this.prisma.order.findMany({
          where: { merchantId: merchant.id },
          include: {
            items: {
              include: {
                menuVariant: {
                  include: { menu: true },
                },
              },
            },
            user: {
              select: { id: true, image: true },
            },
          },
          orderBy: { id: "desc" },
          take: limit,
          skip,
        }),
        this.prisma.order.count({ where: { merchantId: merchant.id } }),
      ]);

      return {
        data: orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getMerchantPendingOrders(user: User) {
    try {
      const merchant = await this.prisma.merchant.findFirst({
        where: { ownerId: user.id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      return await this.prisma.order.findMany({
        where: {
          merchantId: merchant.id,
          status: { in: ["PAID", "PREPARING"] },
        },
        include: {
          items: {
            include: {
              menuVariant: {
                include: { menu: true },
              },
            },
          },
          user: {
            select: { id: true, image: true },
          },
        },
        orderBy: { id: "desc" },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async acceptOrder(id: string, user: User): Promise<Order> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findFirst({
        where: { ownerId: user.id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      if (order.merchantId !== merchant.id)
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      if (order.status !== "PAID")
        throw new HttpException(
          "Order cannot be accepted",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
          where: { id },
          data: { status: "PREPARING" },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: "PREPARING",
            changedAt: new Date(),
            changedBy: user.id,
          },
        });

        return updated;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async rejectOrder(id: string, user: User): Promise<Order> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const merchant = await this.prisma.merchant.findFirst({
        where: { ownerId: user.id },
      });

      if (!merchant)
        throw new HttpException("Merchant not found", HttpStatus.NOT_FOUND);

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      if (order.merchantId !== merchant.id)
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      if (order.status !== "PAID")
        throw new HttpException(
          "Order cannot be rejected",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
          where: { id },
          data: {
            status: "CANCELLED",
            paymentStatus: "REFUNDED",
          },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: "CANCELLED",
            changedAt: new Date(),
            changedBy: user.id,
          },
        });

        return updated;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAvailableOrdersForDriver(user: User) {
    try {
      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
        include: {
          driverLocations: {
            orderBy: { recordedAt: "desc" },
            take: 1,
          },
        },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const orders = await this.prisma.order.findMany({
        where: {
          status: "READY",
          driverId: null,
        },
        include: {
          merchant: true,
          user: {
            select: { id: true, image: true },
          },
        },
      });

      if (!driver.driverLocations[0]) return orders;

      const driverLat = Number(driver.driverLocations[0].latitude);
      const driverLng = Number(driver.driverLocations[0].longitude);

      return orders
        .map((order) => ({
          ...order,
          distance: this.calculateDistance(
            driverLat,
            driverLng,
            Number(order.merchant.latitude),
            Number(order.merchant.longitude),
          ),
        }))
        .filter((order) => order.distance <= 10)
        .sort((a, b) => a.distance - b.distance);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  async acceptDelivery(id: string, user: User): Promise<Order> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      if (!driver.isAvailable)
        throw new HttpException(
          "Driver is not available",
          HttpStatus.BAD_REQUEST,
        );

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      if (order.status !== "READY")
        throw new HttpException(
          "Order is not ready for delivery",
          HttpStatus.BAD_REQUEST,
        );

      if (order.driverId)
        throw new HttpException(
          "Order already has a driver assigned",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
          where: { id },
          data: {
            driverId: driver.id,
            status: "ON_DELIVERY",
          },
        });

        await tx.driver.update({
          where: { id: driver.id },
          data: { isAvailable: false },
        });

        await tx.delivery.create({
          data: {
            orderId: id,
            driverId: driver.id,
            pickedAt: new Date(),
            deliveredAt: new Date(),
            distanceKm: 0,
          },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: "ON_DELIVERY",
            changedAt: new Date(),
            changedBy: user.id,
          },
        });

        return updated;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async markOrderPickedUp(id: string, user: User): Promise<Order> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      if (order.driverId !== driver.id)
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      await this.prisma.delivery.updateMany({
        where: { orderId: id },
        data: { pickedAt: new Date() },
      });

      return order;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async markOrderDelivered(id: string, user: User): Promise<Order> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const driver = await this.prisma.driver.findFirst({
        where: { userId: user.id },
      });

      if (!driver)
        throw new HttpException("Driver not found", HttpStatus.NOT_FOUND);

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      if (order.driverId !== driver.id)
        throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

      if (order.status !== "ON_DELIVERY")
        throw new HttpException(
          "Order is not on delivery",
          HttpStatus.BAD_REQUEST,
        );

      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
          where: { id },
          data: { status: "COMPLETED" },
        });

        await tx.driver.update({
          where: { id: driver.id },
          data: { isAvailable: true },
        });

        await tx.delivery.updateMany({
          where: { orderId: id },
          data: { deliveredAt: new Date() },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: "COMPLETED",
            changedAt: new Date(),
            changedBy: user.id,
          },
        });

        return updated;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private findUserCart(userId: string) {
    return this.prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
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
    menuVariants: (MenuVariant & { menu: Menu })[],
  ) {
    for (const item of cartItems) {
      const variant = menuVariants.find((v) => v.id === item.variantId);

      if (!variant)
        throw new HttpException("Menu Variant not found", HttpStatus.NOT_FOUND);
      if (!variant.menu.isAvailable)
        throw new HttpException(
          "Menu is not available",
          HttpStatus.BAD_REQUEST,
        );
      if (item.quantity < 1)
        throw new HttpException("Invalid quantity", HttpStatus.BAD_REQUEST);
    }
  }
}
