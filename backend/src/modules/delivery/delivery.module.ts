import { Module } from "@nestjs/common";
import {
  DeliveryController,
  DriverDeliveryController,
} from "./delivery.controller";
import { DeliveryService } from "./delivery.service";

@Module({
  providers: [DeliveryService],
  controllers: [DeliveryController, DriverDeliveryController],
  exports: [DeliveryService],
})
export class DeliveryModule {}
