/* eslint-disable @typescript-eslint/no-misused-promises */
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { Pakasir } from "pakasir-sdk";
import { PaymentMethod } from "../modules/payment/types";
import { User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PaymentService } from "../modules/payment/payment.service";

const POLLING_INTERVAL_MS = parseInt(
  process.env.PAYMENT_POLLING_INTERVAL_MS ?? "3000",
  10,
);
const POLLING_TIMEOUT_MS = parseInt(
  process.env.PAYMENT_POLLING_TIMEOUT_MS ?? "600000",
  10,
);
const MAX_RETRY_ATTEMPTS = parseInt(
  process.env.PAYMENT_POLLING_MAX_RETRIES ?? "3",
  10,
);

@Injectable()
export class PaymentGateway {
  private readonly pakasir: Pakasir;
  private readonly activeWatchers: Map<
    string,
    { orderId: string; startedAt: Date }
  > = new Map();

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {
    this.pakasir = new Pakasir({
      slug: process.env.PAKASIR_SLUG ?? "",
      apikey: process.env.PAKASIR_KEY ?? "",
    });
  }

  async createPayment(
    orderId: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ) {
    return await this.pakasir.createPayment(paymentMethod, orderId, amount);
  }

  async processPayment(orderId: string, amount: number) {
    return await this.pakasir.simulationPayment(orderId, amount);
  }

  isWatching(paymentId: string): boolean {
    return this.activeWatchers.has(paymentId);
  }

  stopWatching(paymentId: string): void {
    if (this.activeWatchers.has(paymentId)) {
      this.activeWatchers.delete(paymentId);
      this.logger.info(`Stopped watching payment: ${paymentId}`);
    }
  }

  getActiveWatchers(): Map<string, { orderId: string; startedAt: Date }> {
    return new Map(this.activeWatchers);
  }

  watchPayment(orderId: string, amount: number, paymentId: string, user: User) {
    if (this.activeWatchers.has(paymentId)) {
      this.logger.warn(
        `Payment ${paymentId} is already being watched, skipping duplicate watcher`,
      );
      return;
    }

    this.activeWatchers.set(paymentId, {
      orderId,
      startedAt: new Date(),
    });

    let retryCount = 0;

    this.logger.info(
      `Starting payment watcher for ${paymentId} (interval: ${POLLING_INTERVAL_MS}ms, timeout: ${POLLING_TIMEOUT_MS}ms)`,
    );

    const timeoutId = setTimeout(() => {
      this.logger.warn(`Payment watcher timed out for ${paymentId}`);
      this.pakasir.stopWatch(orderId, amount);
      this.stopWatching(paymentId);
    }, POLLING_TIMEOUT_MS);

    this.pakasir.watchPayment(orderId, amount, {
      interval: POLLING_INTERVAL_MS,
      timeout: POLLING_TIMEOUT_MS,

      onStatusChange: async (payment) => {
        this.logger.info(
          `Payment status changed for ${paymentId}: ${JSON.stringify(payment.status)}`,
        );

        if (payment.status === "completed") {
          clearTimeout(timeoutId);
          try {
            await this.paymentService.paymentSuccess(paymentId, user);
            this.stopWatching(paymentId);
          } catch (error) {
            this.logger.error(
              `Failed to process payment success for ${paymentId}: ${error}`,
            );
          }
        } else if (payment.status === "canceled") {
          clearTimeout(timeoutId);
          this.logger.warn(`Payment ${paymentId} was canceled`);
          this.stopWatching(paymentId);
        }
      },

      onError: (error) => {
        retryCount++;
        this.logger.error(
          `Payment watch error for ${paymentId} (attempt ${retryCount}/${MAX_RETRY_ATTEMPTS}): ${error.message}`,
        );

        if (retryCount >= MAX_RETRY_ATTEMPTS) {
          clearTimeout(timeoutId);
          this.logger.error(
            `Max retry attempts reached for payment ${paymentId}, stopping watcher`,
          );
          this.pakasir.stopWatch(orderId, amount);
          this.stopWatching(paymentId);
        }
      },
    });
  }
}
