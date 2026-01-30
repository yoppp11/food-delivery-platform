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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const prisma = new PrismaService();

  app.enableCors({
    origin: ["http://localhost:4000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Merchant-Id"],
  });
  
  // Enable WebSocket adapter with CORS
  app.useWebSocketAdapter(new IoAdapter(app));
  
  app.useLogger(logger);
  app.setGlobalPrefix("api");
  app.useGlobalInterceptors(new CurrentUserInterceptor(prisma, logger));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
