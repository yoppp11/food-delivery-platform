import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { CartService } from "../cart/cart.service";

@Module({
  providers: [OrderService, CartService],
  controllers: [OrderController],
})
export class OrderModule {}
