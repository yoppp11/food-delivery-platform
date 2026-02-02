import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ChatService } from "./chat.service.new";
import { ChatController } from "./chat.controller.new";
import { ChatAdminController } from "./chat-admin.controller";
import { ChatGateway } from "./chat.gateway.new";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController, ChatAdminController],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
