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
import { RedisCacheModule } from "./common/cache";
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
import { MerchantOrderController } from "./modules/order/merchant-order.controller";
import { DriverOrderController } from "./modules/order/driver-order.controller";
import { OrderService } from "./modules/order/order.service";
import { PaymentGateway } from "./common/payment-gateway.service";
import { PaymentModule } from "./modules/payment/payment.module";
import { PaymentController } from "./modules/payment/payment.controller";
import { PaymentService } from "./modules/payment/payment.service";
import { DriverModule } from "./modules/driver/driver.module";
import { DriverService } from "./modules/driver/driver.service";
import { DriverController } from "./modules/driver/driver.controller";
import { GlobalCategoryModule } from "./modules/category/category.module";
import { CategoryController } from "./modules/category/category.controller";
import { CategoryService } from "./modules/category/category.service";
import { AddressModule } from "./modules/address/address.module";
import { AddressController } from "./modules/address/address.controller";
import { AddressService } from "./modules/address/address.service";
import { NotificationModule } from "./modules/notification/notification.module";
import { NotificationController } from "./modules/notification/notification.controller";
import { NotificationService } from "./modules/notification/notification.service";
import { PromotionModule } from "./modules/promotion/promotion.module";
import { PromotionController } from "./modules/promotion/promotion.controller";
import { PromotionService } from "./modules/promotion/promotion.service";
import { ReviewModule } from "./modules/review/review.module";
import { ReviewController } from "./modules/review/review.controller";
import { ReviewService } from "./modules/review/review.service";
import { DeliveryModule } from "./modules/delivery/delivery.module";
import { DeliveryController } from "./modules/delivery/delivery.controller";
import { DeliveryService } from "./modules/delivery/delivery.service";
import { AdminModule } from "./modules/admin/admin.module";
import { AdminController } from "./modules/admin/admin.controller";
import { AdminService } from "./modules/admin/admin.service";
import { HealthModule } from "./modules/health/health.module";
import { HealthController } from "./modules/health/health.controller";
import { ChatModule } from "./modules/chat/chat.module";
import { ChatController } from "./modules/chat/chat.controller";
import { ChatService } from "./modules/chat/chat.service";
import { QueueModule } from "./modules/queue/queue.module";

@Module({
  imports: [
    WinstonModule.forRoot({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${JSON.stringify(message)}`;
        }),
      ),
      transports: [new winston.transports.Console()],
    }),
    AuthModule.forRoot({
      auth,
      // disableControllers: true,
      // disableGlobalAuthGuard: true,
      disableTrustedOriginsCors: true,
      middleware: (req, _res, next) => {
        req.url = req.originalUrl;
        req.baseUrl = "";
        next();
      },
    }),
    // ValidationModule.forRoot(),
    RedisCacheModule,
    QueueModule,
    UserModule,
    LibModule,
    CategoryModule,
    MenuModule,
    MerchantModule,
    UploadModule,
    CartModule,
    OrderModule,
    PaymentModule,
    DriverModule,
    GlobalCategoryModule,
    AddressModule,
    NotificationModule,
    PromotionModule,
    ReviewModule,
    DeliveryModule,
    AdminModule,
    HealthModule,
    ChatModule,
  ],
  controllers: [
    UserController,
    MerchantCategoryController,
    MenuController,
    MerchantOrderController,
    MerchantController,
    UploadController,
    CartController,
    OrderController,
    DriverOrderController,
    PaymentController,
    DriverController,
    CategoryController,
    AddressController,
    NotificationController,
    PromotionController,
    ReviewController,
    DeliveryController,
    AdminController,
    HealthController,
    ChatController,
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
    DriverService,
    CategoryService,
    AddressService,
    NotificationService,
    PromotionService,
    ReviewService,
    DeliveryService,
    AdminService,
    ChatService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: "api/auth/(.*)", method: RequestMethod.ALL },
        { path: "api/merchants", method: RequestMethod.GET },
        { path: "api/merchants/:id", method: RequestMethod.GET },
        { path: "api/merchants/:id/menus", method: RequestMethod.GET },
        { path: "api/merchants/:id/reviews", method: RequestMethod.GET },
        {
          path: "api/merchants/:id/operational-hours",
          method: RequestMethod.GET,
        },
        { path: "api/categories", method: RequestMethod.GET },
        { path: "api/categories/(.*)", method: RequestMethod.GET },
        { path: "api/menus", method: RequestMethod.GET },
        { path: "api/menus/(.*)", method: RequestMethod.GET },
        {
          path: "api/reviews/merchants/:merchantId",
          method: RequestMethod.GET,
        },
        { path: "api/reviews/drivers/:driverId", method: RequestMethod.GET },
      )
      .forRoutes({
        path: "api/*",
        method: RequestMethod.ALL,
      });
  }
}
