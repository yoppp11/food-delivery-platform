import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { CartService } from "../cart/cart.service";
import { OrderGateway } from "./order.gateway";
import { DriverModule } from "../driver/driver.module";
import { NotificationModule } from "../notification/notification.module";
import { MerchantOrderController } from "./merchant-order.controller";
import { DriverOrderController } from "./driver-order.controller";

@Module({
  imports: [
    DriverModule,
    NotificationModule,
    BullModule.registerQueue({
      name: "driver-assignment",
    }),
  ],
  providers: [OrderService, CartService, OrderGateway],
  controllers: [
    OrderController,
    MerchantOrderController,
    DriverOrderController,
  ],
  exports: [OrderService, OrderGateway],
})
export class OrderModule {}
