import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { auth } from "./common/auth.service";
import { LibModule } from "./common/common.module";
import { UserModule } from "./modules/user/user.module";
import { UserController } from "./modules/user/user.controller";
import { UserService } from "./modules/user/user.service";
import { CategoryModule } from "./modules/merchant-category/merchant-category.module";
import { MenuModule } from "./modules/menu/menu.module";
import { MenuController } from "./modules/menu/menu.controller";
import { MenuService } from "./modules/menu/menu.service";
import { MerchantModule } from "./modules/merchant/merchant.module";
import { MerchantController } from "./modules/merchant/merchant.controller";
import { MerchantService } from "./modules/merchant/merchant.service";
import { UploadModule } from "./modules/upload/upload.module";
import { UploadController } from "./modules/upload/upload.controller";
import { AuthenticationMiddleware } from "./common/middleware/auth.middleware";
import { MerchantCategoryController } from "./modules/merchant-category/merchant-category.controller";
import { MerchantCategoryService } from "./modules/merchant-category/merchant-category.service";
import { CartController } from "./modules/cart/cart.controller";
import { CartModule } from "./modules/cart/cart.module";
import { CartService } from "./modules/cart/cart.service";
import { OrderModule } from "./modules/order/order.module";
import { OrderController } from "./modules/order/order.controller";
import { OrderService } from "./modules/order/order.service";
import { PaymentGateway } from "./common/payment-gateway.service";
import { PaymentModule } from "./modules/payment/payment.module";
import { PaymentController } from "./modules/payment/payment.controller";
import { PaymentService } from "./modules/payment/payment.service";

@Module({
  imports: [
    WinstonModule.forRoot({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${JSON.stringify(message)}`;
        })
      ),
      transports: [new winston.transports.Console()],
    }),
    AuthModule.forRoot({
      auth,
      // disableControllers: true,
      // disableGlobalAuthGuard: true,
      middleware: (req, _res, next) => {
        req.url = req.originalUrl;
        req.baseUrl = "";
        next();
      },
    }),
    // ValidationModule.forRoot(),
    UserModule,
    LibModule,
    CategoryModule,
    MenuModule,
    MerchantModule,
    UploadModule,
    CartModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [
    UserController,
    MerchantCategoryController,
    MenuController,
    MerchantController,
    UploadController,
    CartController,
    OrderController,
    PaymentController,
  ],
  providers: [
    UserService,
    MerchantCategoryService,
    MenuService,
    MerchantService,
    CartService,
    OrderService,
    PaymentGateway,
    PaymentService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes({
      path: "api/*",
      method: RequestMethod.ALL,
    });
  }
}
