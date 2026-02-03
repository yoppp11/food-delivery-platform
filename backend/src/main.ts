/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from "@nestjs/core";
import "dotenv/config";
import { AppModule } from "./app.module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CurrentUserInterceptor } from "./common/interceptors";
import { PrismaService } from "./common/prisma.service";
import cookieParser from "cookie-parser";
import * as express from "express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { RequestMethod } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const prisma = new PrismaService();

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:4000", "http://localhost:5173"];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Merchant-Id"],
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  app.useLogger(logger);
  app.setGlobalPrefix("api", {
    exclude: [{ path: "health/(.*)", method: RequestMethod.GET }],
  });
  app.useGlobalInterceptors(new CurrentUserInterceptor(prisma, logger));

  const port = process.env.PORT ?? 3001;
  await app.listen(port, "0.0.0.0");
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
