import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { PaymentGateway } from "../../common/payment-gateway.service";

@Module({
  providers: [PaymentService, PaymentGateway],
  controllers: [PaymentController],
})
export class PaymentModule {}
