import { Injectable } from "@nestjs/common";
import { Pakasir } from "pakasir-sdk";
import { PaymentMethod } from "../modules/payment/types";

@Injectable()
export class PaymentGateway {
  private readonly pakasir: Pakasir;

  constructor() {
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
}
