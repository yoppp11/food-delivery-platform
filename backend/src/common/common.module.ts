import { Global, Module, forwardRef } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Auth } from "./auth.service";
import { PaymentGateway } from "./payment-gateway.service";
import { PaymentModule } from "../modules/payment/payment.module";

@Global()
@Module({
  imports: [forwardRef(() => PaymentModule)],
  providers: [PrismaService, Auth, PaymentGateway],
  exports: [PrismaService, Auth, PaymentGateway],
})
export class LibModule {}
