import {
  Logger,
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
import { UserController } from "./modules/user/user/user.controller";
import { UserService } from "./modules/user/user/user.service";
import { ValidationModule } from "./validation/validation.module";
import { CategoryModule } from "./modules/category/category.module";
import { CategoryController } from "./modules/category/category/category.controller";
import { CategoryService } from "./modules/category/category/category.service";
import { MenuModule } from "./modules/menu/menu.module";
import { MenuController } from "./modules/menu/menu.controller";
import { MenuService } from "./modules/menu/menu.service";
import { MerchantModule } from "./modules/merchant/merchant.module";
import { MerchantController } from "./modules/merchant/merchant.controller";
import { MerchantService } from "./modules/merchant/merchant.service";
import { UploadModule } from "./modules/upload/upload.module";
import { UploadController } from "./modules/upload/upload.controller";
import { AuthenticationMiddleware } from "./common/middleware/auth.middleware";

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
      middleware: (req, _res, next) => {
        req.url = req.originalUrl;
        req.baseUrl = "";
        next();
      },
    }),
    ValidationModule.forRoot(),
    UserModule,
    LibModule,
    CategoryModule,
    MenuModule,
    MerchantModule,
    UploadModule,
  ],
  controllers: [
    UserController,
    CategoryController,
    MenuController,
    MerchantController,
    UploadController,
  ],
  providers: [UserService, CategoryService, MenuService, MerchantService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes({
      path: "api/*",
      method: RequestMethod.ALL,
    });
  }
}
