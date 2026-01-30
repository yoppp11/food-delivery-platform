import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Global,
} from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { PrismaService } from "../src/common/prisma.service";
import { ChatModule } from "../src/modules/chat/chat.module";
import { ChatController } from "../src/modules/chat/chat.controller";
import { ChatService } from "../src/modules/chat/chat.service";
import { User } from "@prisma/client";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
class TestLibModule {}

class TestAuthMiddleware {
  use(
    req: Request & { user: User },
    _res: Response,
    next: () => void,
  ) {
    (req as any).user = { id: "chat-test-customer" };
    next();
  }
}

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
      transports: [new winston.transports.Console({ silent: true })],
    }),
    TestLibModule,
    ChatModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class TestAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TestAuthMiddleware)
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL,
      });
  }
}
