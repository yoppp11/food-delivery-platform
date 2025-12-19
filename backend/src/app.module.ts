import { Logger, Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./lib/auth";
import { UserModule } from "./user/user.module";
import { UserController } from "./user/user/user.controller";

@Module({
  imports: [
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
    UserModule,
  ],
  controllers: [UserController],
})
export class AppModule {}
