import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Inject, UseGuards } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { ChatService } from "./chat.service.new";
import { MessageType, MessageStatus, ChatRoomStatus } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../common/prisma.service";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface JoinRoomPayload {
  chatRoomId: string;
}

interface LeaveRoomPayload {
  chatRoomId: string;
}

interface SendMessagePayload {
  chatRoomId: string;
  content: string;
  type?: MessageType;
  metadata?: Record<string, unknown>;
  clientMessageId?: string;
}

interface TypingPayload {
  chatRoomId: string;
  isTyping: boolean;
}

interface ReadPayload {
  chatRoomId: string;
  lastReadMessageId?: string;
}

interface AckPayload {
  messageId: string;
  status: "delivered";
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(",") || "*",
    credentials: true,
  },
  namespace: "/chat",
  transports: ["websocket", "polling"],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private connectedUsers: Map<string, Set<string>> = new Map();
  
  private socketRooms: Map<string, Set<string>> = new Map();

  private messageRateLimits: Map<string, { count: number; resetAt: number }> = new Map();
  private readonly RATE_LIMIT_WINDOW = 60000;
  private readonly RATE_LIMIT_MAX_MESSAGES = 60;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = 
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace("Bearer ", "") ||
        client.handshake.query?.token;

      const fallbackUserId = 
        client.handshake.auth?.userId || 
        client.handshake.query?.userId;

      let userId: string | undefined;
      let userRole: string | undefined;

      if (token && typeof token === "string") {
        try {
          const payload = await this.jwtService.verifyAsync(token);
          userId = payload.sub || payload.userId;
          userRole = payload.role;
          this.logger.info(`User ${userId} authenticated via JWT token`);
        } catch (jwtError) {
          this.logger.warn(`Invalid JWT token for socket ${client.id}`, { error: jwtError });
          
          const session = await this.prisma.session.findFirst({
            where: { 
              token: token,
              expiresAt: { gt: new Date() },
            },
            include: { user: { select: { id: true, role: true } } },
          });

          if (session) {
            userId = session.userId;
            userRole = session.user.role;
            this.logger.info(`User ${userId} authenticated via session token`);
          }
        }
      }

      if (!userId && fallbackUserId && typeof fallbackUserId === "string") {
        userId = fallbackUserId;
        this.logger.warn(`User ${userId} connected using deprecated userId auth method`);
        
        // Verify user exists
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true, status: true },
        });

        if (!user || user.status !== "ACTIVE") {
          throw new WsException("Invalid user");
        }
        userRole = user.role;
      }

      if (!userId) {
        this.logger.warn(`Socket ${client.id} connected without valid authentication`);
        client.emit("chat:error", { 
          code: "AUTH_FAILED",
          message: "Authentication required. Please provide a valid token.",
        });
        client.disconnect();
        return;
      }

      client.userId = userId;
      client.userRole = userRole;

      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId)!.add(client.id);
      this.socketRooms.set(client.id, new Set());

      client.join(`user:${userId}`);

      const unreadCount = await this.chatService.getUnreadCount(userId);
      
      client.emit("chat:connected", {
        userId,
        unreadCount,
        timestamp: new Date().toISOString(),
      });

      this.logger.info(`User ${userId} connected with socket ${client.id}`, {
        role: userRole,
        totalConnections: this.connectedUsers.get(userId)?.size,
      });

    } catch (error: any) {
      this.logger.error(`Connection error for socket ${client.id}`, { error: error.message });
      client.emit("chat:error", {
        code: "CONNECTION_FAILED",
        message: error.message || "Failed to establish connection",
      });
      client.disconnect();
    }
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

      const rooms = this.socketRooms.get(client.id);
      if (rooms) {
        rooms.forEach((roomId) => {
          client.to(`room:${roomId}`).emit("chat:typing", {
            chatRoomId: roomId,
            userId: client.userId,
            isTyping: false,
          });
        });
      }
      this.socketRooms.delete(client.id);

      this.logger.info(`User ${client.userId} disconnected socket ${client.id}`);
    }
  }

  @SubscribeMessage("chat:join")
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: JoinRoomPayload,
  ) {
    if (!client.userId) {
      client.emit("chat:error", { 
        code: "AUTH_REQUIRED",
        message: "Authentication required",
      });
      return;
    }

    if (!data.chatRoomId) {
      client.emit("chat:error", { 
        code: "INVALID_PAYLOAD",
        message: "Chat room ID is required",
      });
      return;
    }

    try {
      const room = await this.chatService.getChatRoomById(data.chatRoomId, client.userId);
      
      if (!room) {
        client.emit("chat:error", { 
          code: "ROOM_NOT_FOUND",
          message: "Chat room not found or access denied",
          chatRoomId: data.chatRoomId,
        });
        return;
      }

      const roomName = `room:${data.chatRoomId}`;
      client.join(roomName);

      this.socketRooms.get(client.id)?.add(data.chatRoomId);

      const readResult = await this.chatService.markMessagesAsRead(data.chatRoomId, client.userId);

      if (readResult.markedCount > 0) {
        client.to(roomName).emit("chat:read", {
          chatRoomId: data.chatRoomId,
          userId: client.userId,
          timestamp: new Date().toISOString(),
        });
      }

      client.emit("chat:joined", {
        chatRoomId: data.chatRoomId,
        participants: room.participants,
        status: room.status,
        type: room.type,
      });

      this.logger.info(`User ${client.userId} joined room ${data.chatRoomId}`);

    } catch (error: any) {
      this.logger.error(`Error joining room: ${error.message}`, {
        userId: client.userId,
        chatRoomId: data.chatRoomId,
      });
      client.emit("chat:error", {
        code: "JOIN_FAILED",
        message: error.message || "Failed to join room",
        chatRoomId: data.chatRoomId,
      });
    }
  }

  @SubscribeMessage("chat:leave")
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: LeaveRoomPayload,
  ) {
    if (!data.chatRoomId) return;

    const roomName = `room:${data.chatRoomId}`;
    client.leave(roomName);

    this.socketRooms.get(client.id)?.delete(data.chatRoomId);

    client.to(roomName).emit("chat:typing", {
      chatRoomId: data.chatRoomId,
      userId: client.userId,
      isTyping: false,
    });

    this.logger.info(`User ${client.userId} left room ${data.chatRoomId}`);
  }

  @SubscribeMessage("chat:message")
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SendMessagePayload,
  ) {
    if (!client.userId) {
      client.emit("chat:error", { 
        code: "AUTH_REQUIRED",
        message: "Authentication required",
      });
      return;
    }

    if (!data.chatRoomId || !data.content) {
      client.emit("chat:error", { 
        code: "INVALID_PAYLOAD",
        message: "Chat room ID and content are required",
      });
      return;
    }

    if (data.content.trim().length === 0) {
      client.emit("chat:error", { 
        code: "EMPTY_MESSAGE",
        message: "Message content cannot be empty",
      });
      return;
    }

    if (!this.checkRateLimit(client.userId)) {
      client.emit("chat:error", {
        code: "RATE_LIMITED",
        message: "Too many messages. Please wait a moment before sending more.",
        clientMessageId: data.clientMessageId,
      });
      return;
    }

    try {
      const message = await this.chatService.sendMessage(client.userId, {
        chatRoomId: data.chatRoomId,
        content: data.content,
        type: data.type,
        metadata: data.metadata,
        clientMessageId: data.clientMessageId,
      });

      const messagePayload = {
        ...message,
        clientMessageId: data.clientMessageId,
      };

      this.server.to(`room:${data.chatRoomId}`).emit("chat:message", messagePayload);

      const room = await this.chatService.getChatRoomById(data.chatRoomId, client.userId);
      if (room) {
        this.notifyOfflineParticipants(
          data.chatRoomId,
          message,
          room.participants.map((p) => p.userId),
          client.userId,
        );
      }

      client.to(`room:${data.chatRoomId}`).emit("chat:typing", {
        chatRoomId: data.chatRoomId,
        userId: client.userId,
        isTyping: false,
      });

    } catch (error: any) {
      this.logger.error(`Error sending message: ${error.message}`, {
        userId: client.userId,
        chatRoomId: data.chatRoomId,
      });

      if (data.clientMessageId) {
        client.emit("chat:message-status", {
          clientMessageId: data.clientMessageId,
          status: MessageStatus.FAILED,
          error: error.message,
        });
      }

      client.emit("chat:error", {
        code: error.status === 403 ? "CHAT_CLOSED" : "SEND_FAILED",
        message: error.message || "Failed to send message",
        chatRoomId: data.chatRoomId,
        clientMessageId: data.clientMessageId,
      });
    }
  }

  @SubscribeMessage("chat:typing")
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: TypingPayload,
  ) {
    if (!client.userId || !data.chatRoomId) return;

    client.to(`room:${data.chatRoomId}`).emit("chat:typing", {
      chatRoomId: data.chatRoomId,
      userId: client.userId,
      isTyping: data.isTyping,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage("chat:read")
  async handleRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: ReadPayload,
  ) {
    if (!client.userId || !data.chatRoomId) return;

    try {
      const result = await this.chatService.markMessagesAsRead(
        data.chatRoomId,
        client.userId,
        data.lastReadMessageId,
      );

      if (result.markedCount > 0) {
        client.to(`room:${data.chatRoomId}`).emit("chat:read", {
          chatRoomId: data.chatRoomId,
          userId: client.userId,
          lastReadMessageId: data.lastReadMessageId,
          timestamp: new Date().toISOString(),
        });
      }

    } catch (error: any) {
      this.logger.error(`Error marking messages as read: ${error.message}`, {
        userId: client.userId,
        chatRoomId: data.chatRoomId,
      });
    }
  }

  @SubscribeMessage("chat:ack")
  async handleAck(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: AckPayload,
  ) {
    if (!client.userId || !data.messageId) return;

    try {
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: data.messageId },
        select: { chatRoomId: true, senderId: true, status: true },
      });

      if (message && message.senderId !== client.userId) {
        if (message.status === MessageStatus.SENT) {
          await this.prisma.chatMessage.update({
            where: { id: data.messageId },
            data: { status: MessageStatus.DELIVERED },
          });

          this.server.to(`user:${message.senderId}`).emit("chat:message-status", {
            messageId: data.messageId,
            status: MessageStatus.DELIVERED,
          });
        }
      }
    } catch (error: any) {
      this.logger.error(`Error handling message ack: ${error.message}`);
    }
  }

  notifyOfflineParticipants(
    chatRoomId: string,
    message: any,
    participantIds: string[],
    senderId: string,
  ) {
    participantIds.forEach((userId) => {
      if (userId === senderId) return;

      const userSockets = this.connectedUsers.get(userId);
      let isInRoom = false;

      if (userSockets) {
        for (const socketId of userSockets) {
          const rooms = this.socketRooms.get(socketId);
          if (rooms?.has(chatRoomId)) {
            isInRoom = true;
            break;
          }
        }
      }

      if (!isInRoom) {
        this.server.to(`user:${userId}`).emit("chat:notification", {
          type: "new-message",
          chatRoomId,
          preview: message.content.substring(0, 100),
          senderId,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  broadcastRoomStatusChange(
    chatRoomId: string,
    status: ChatRoomStatus,
    reason?: string,
  ) {
    this.server.to(`room:${chatRoomId}`).emit("chat:room-status", {
      chatRoomId,
      status,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  broadcastParticipantChange(
    chatRoomId: string,
    participant: any,
    action: "joined" | "left",
  ) {
    this.server.to(`room:${chatRoomId}`).emit("chat:participant", {
      chatRoomId,
      participant,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  broadcastToChatRoom(chatRoomId: string, event: string, data: unknown) {
    this.server.to(`room:${chatRoomId}`).emit(event, data);
  }

  notifyUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  getConnectedUserCount(): number {
    return this.connectedUsers.size;
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.messageRateLimits.get(userId);

    if (!userLimit || now > userLimit.resetAt) {
      this.messageRateLimits.set(userId, {
        count: 1,
        resetAt: now + this.RATE_LIMIT_WINDOW,
      });
      return true;
    }

    if (userLimit.count >= this.RATE_LIMIT_MAX_MESSAGES) {
      return false;
    }

    userLimit.count++;
    return true;
  }
}
