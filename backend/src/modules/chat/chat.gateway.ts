import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { ChatService } from "./chat.service";
import { MessageType } from "@prisma/client";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  namespace: "/chat",
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedUsers: Map<string, Set<string>> = new Map();

  constructor(
    private readonly chatService: ChatService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;
    
    if (!userId || typeof userId !== "string") {
      this.logger.warn(`Client ${client.id} connected without userId`);
      client.disconnect();
      return;
    }

    client.userId = userId;
    
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId)!.add(client.id);

    this.logger.info(`User ${userId} connected with socket ${client.id}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedUsers.get(client.userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(client.userId);
        }
      }
      this.logger.info(`User ${client.userId} disconnected socket ${client.id}`);
    }
  }

  @SubscribeMessage("chat:join")
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string },
  ) {
    if (!client.userId) return;

    const room = await this.chatService.getChatRoomById(data.chatRoomId, client.userId);
    if (!room) {
      client.emit("error", { message: "Chat room not found" });
      return;
    }

    client.join(`room:${data.chatRoomId}`);
    this.logger.info(`User ${client.userId} joined room ${data.chatRoomId}`);
    
    await this.chatService.markMessagesAsRead(data.chatRoomId, client.userId);
    
    client.emit("chat:joined", { chatRoomId: data.chatRoomId });
  }

  @SubscribeMessage("chat:leave")
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string },
  ) {
    client.leave(`room:${data.chatRoomId}`);
    this.logger.info(`User ${client.userId} left room ${data.chatRoomId}`);
  }

  @SubscribeMessage("chat:message")
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string; content: string; type?: MessageType },
  ) {
    if (!client.userId) return;

    try {
      const message = await this.chatService.sendMessage(client.userId, {
        chatRoomId: data.chatRoomId,
        content: data.content,
        type: data.type,
      });

      this.server.to(`room:${data.chatRoomId}`).emit("chat:message", {
        ...message,
        sender: { id: client.userId },
      });
    } catch (error) {
      this.logger.error(`Error sending message: ${error}`);
      client.emit("error", { message: "Failed to send message" });
    }
  }

  @SubscribeMessage("chat:typing")
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string; isTyping: boolean },
  ) {
    if (!client.userId) return;

    client.to(`room:${data.chatRoomId}`).emit("chat:typing", {
      userId: client.userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage("chat:read")
  async handleRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string },
  ) {
    if (!client.userId) return;

    await this.chatService.markMessagesAsRead(data.chatRoomId, client.userId);
    
    client.to(`room:${data.chatRoomId}`).emit("chat:read", {
      userId: client.userId,
      chatRoomId: data.chatRoomId,
    });
  }

  notifyNewMessage(chatRoomId: string, message: unknown, participantIds: string[]) {
    participantIds.forEach((userId) => {
      const sockets = this.connectedUsers.get(userId);
      if (sockets) {
        sockets.forEach((socketId) => {
          this.server.to(socketId).emit("chat:new-message", {
            chatRoomId,
            message,
          });
        });
      }
    });
  }
}
