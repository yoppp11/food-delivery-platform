import { Module, Global, forwardRef } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { DriverAssignmentProcessor } from "./driver-assignment.processor";
import { OrderModule } from "../order/order.module";

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
      },
    }),
    BullModule.registerQueue({
      name: "driver-assignment",
    }),
    forwardRef(() => OrderModule),
  ],
  providers: [DriverAssignmentProcessor],
  exports: [BullModule],
})
export class QueueModule {}
