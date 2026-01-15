/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { Merchant, Order, OrderItem, Payment, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PaymentGateway } from "../../common/payment-gateway.service";
import { CreatePayment } from "./types";

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pakasir: PaymentGateway,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getPayments(
    user: User
  ): Promise<(Payment & { order: Order & { items: OrderItem[] } })[]> {
    try {
      let where = {};

      if (user.role === "CUSTOMER") where = { customerId: user.id };
      else if (user.role === "MERCHANT") where = { merchantId: user.id };

      const payment = await this.prisma.payment.findMany({
        where,
        include: {
          order: {
            include: {
              items: true,
            },
          },
        },
      });

      return payment;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPaymentById(
    id: string,
    user: User
  ): Promise<
    Payment & {
      customer: User;
      merchant: Merchant;
      order: Order & { items: OrderItem[] };
    }
  > {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: {
          customer: true,
          merchant: true,
          order: {
            include: {
              items: true,
            },
          },
        },
      });

      if (!payment)
        throw new HttpException("Payment not found", HttpStatus.NOT_FOUND);

      if (user.role === "CUSTOMER" && payment.customerId !== user.id)
        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);

      if (user.role === "MERCHANT" && payment.merchant?.ownerId !== user.id)
        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);

      return payment;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createPayment(id: string, body: CreatePayment, user: User) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const order = await this.prisma.order.findFirst({
        where: { id },
        include: {
          merchant: true,
        },
      });

      if (!order)
        throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

      const result = await this.pakasir.createPayment(
        id,
        order.totalPrice,
        body.paymentMethod
      );

      this.logger.info(result);

      if (!result)
        throw new HttpException("Payment failed", HttpStatus.PAYMENT_REQUIRED);

      const initialMerchant = order.merchant.name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join("");

      const prevPayment = await this.prisma.payment.findFirst({
        where: {
          orderId: order.id,
        },
      });

      if (prevPayment) return prevPayment;

      return await this.prisma.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            customerId: user.id,
            merchantId: order.merchantId,
            amount: order.totalPrice,
            paymentType: body.paymentMethod.toUpperCase(),
            transactionId: `TRX-${initialMerchant + order.id}`,
            orderId: id,
          },
        });

        return payment;
      });

      //   return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async paymentSuccess(id: string, user: User) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const payment = await this.prisma.payment.findFirst({
        where: { id },
        include: {
          order: true,
        },
      });

      if (!payment)
        throw new HttpException("Payment not found", HttpStatus.NOT_FOUND);

      const paymentSuccess = await this.pakasir.processPayment(
        id,
        payment.amount
      );

      this.logger.info(paymentSuccess);

      if (!paymentSuccess)
        throw new HttpException(
          "Something went wrong",
          HttpStatus.PAYMENT_REQUIRED
        );

      return await this.prisma.$transaction(async (tx) => {
        const result = await tx.payment.update({
          where: { id },
          data: { status: "SUCCESS" },
          include: { paymentCallbacks: true },
        });

        const payload = {
          transactionId: payment.transactionId,
          paymentType: payment.paymentType,
          amount: payment.amount,
        };

        await tx.paymentCallback.create({
          data: {
            paymentId: id,
            payload: payload,
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: "SUCCESS", status: "PAID" },
        });

        await tx.orderStatusHistory.update({
          where: { id: payment.orderId },
          data: {
            changedAt: new Date(),
            changedBy: user.id,
            status: "PAID",
          },
        });

        return result;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async cancelPayment(id: string, user: User) {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const payment = await this.prisma.payment.findFirst({
        where: { id },
      });

      if (!payment)
        throw new HttpException("Payment not found", HttpStatus.NOT_FOUND);

      if (payment.status === "SUCCESS")
        throw new HttpException(
          "Cannot cancel succesful payment",
          HttpStatus.BAD_REQUEST
        );

      if (payment.status === "CANCEL")
        throw new HttpException(
          "Payment already cancelled",
          HttpStatus.BAD_REQUEST
        );

      return await this.prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
          where: { id },
          data: {
            status: "CANCEL",
          },
        });

        await tx.order.update({
          where: {
            id: payment.orderId,
          },
          data: {
            paymentStatus: "CANCEL",
            status: "CANCELLED",
          },
        });

        await tx.orderStatusHistory.updateMany({
          where: {
            orderId: payment.orderId,
          },
          data: {
            changedAt: new Date(),
            changedBy: user.id,
            status: "CANCELLED",
          },
        });

        return updatedPayment;
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
