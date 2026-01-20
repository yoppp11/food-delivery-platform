import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import {
  OrderController,
  MerchantOrderController,
  DriverOrderController,
} from "./order.controller";
import { CartService } from "../cart/cart.service";

@Module({
  providers: [OrderService, CartService],
  controllers: [
    OrderController,
    MerchantOrderController,
    DriverOrderController,
  ],
  exports: [OrderService],
})
export class OrderModule {}
