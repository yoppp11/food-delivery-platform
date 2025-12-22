import { Logger, Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { auth } from "./lib/auth.service";
import { UserModule } from "./modules/user/user.module";
import { UserController } from "./modules/user/user/user.controller";
import { UserService } from "./modules/user/user/user.service";
import { LibModule } from "./lib/lib.module";
import { ValidationModule } from "./validation/validation.module";

@Module({
  imports: [
    WinstonModule.forRoot({
      level: "debug",
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    AuthModule.forRoot({
      auth,
      middleware: (req, _res, next) => {
        Logger.log({
          originUrl: req.originalUrl,
          baseUrl: req.baseUrl,
          url: req.url,
        });
        req.url = req.originalUrl;
        req.baseUrl = "";
        next();
      },
    }),
    ValidationModule.forRoot(),
    UserModule,
    LibModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
