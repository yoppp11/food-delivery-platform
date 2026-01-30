import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import {
  ChatMessage,
  ChatParticipant,
  ChatRoom,
  ChatRoomType,
  ChatRole,
  MessageType,
  User,
} from "@prisma/client";

export interface CreateChatRoomDto {
  orderId: string;
  type: ChatRoomType;
  participantIds: string[];
}

export interface SendMessageDto {
  chatRoomId: string;
  content: string;
  type?: MessageType;
}

export interface ChatRoomWithParticipants extends ChatRoom {
  participants: (ChatParticipant & {
    user: Pick<User, "id" | "email" | "image">;
  })[];
  messages: ChatMessage[];
}

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getChatRoomsForUser(
    userId: string,
  ): Promise<ChatRoomWithParticipants[]> {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, email: true, image: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        order: {
          select: { id: true, status: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return rooms as unknown as ChatRoomWithParticipants[];
  }

  async getChatRoomById(
    chatRoomId: string,
    userId: string,
  ): Promise<ChatRoomWithParticipants | null> {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, email: true, image: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
        },
        order: {
          select: { id: true, status: true, merchantId: true },
        },
      },
    });
    return room as unknown as ChatRoomWithParticipants | null;
  }

  async getOrCreateChatRoom(
    orderId: string,
    type: ChatRoomType,
    userId: string,
  ): Promise<ChatRoom> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        merchant: { include: { user: true } },
        driver: { include: { user: true } },
      },
    });

    if (!order) {
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
    }

    const existingRoom = await this.prisma.chatRoom.findFirst({
      where: { orderId, type },
      include: { participants: true },
    });

    if (existingRoom) {
      return existingRoom;
    }

    let participantUserIds: { id: string; role: ChatRole }[] = [];

    if (type === ChatRoomType.CUSTOMER_MERCHANT) {
      participantUserIds = [
        { id: order.userId, role: ChatRole.CUSTOMER },
        { id: order.merchant.user.id, role: ChatRole.MERCHANT },
      ];
    } else if (type === ChatRoomType.CUSTOMER_DRIVER) {
      if (!order.driver) {
        throw new HttpException("Driver not assigned", HttpStatus.BAD_REQUEST);
      }
      participantUserIds = [
        { id: order.userId, role: ChatRole.CUSTOMER },
        { id: order.driver.user.id, role: ChatRole.DRIVER },
      ];
    } else if (type === ChatRoomType.CUSTOMER_SUPPORT) {
      participantUserIds = [{ id: order.userId, role: ChatRole.CUSTOMER }];
    }

    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        orderId,
        type,
        participants: {
          create: participantUserIds.map((p) => ({
            userId: p.id,
            role: p.role,
          })),
        },
      },
      include: { participants: true },
    });

    this.logger.info(`Created chat room ${chatRoom.id} for order ${orderId}`);
    return chatRoom;
  }

  async sendMessage(
    userId: string,
    data: SendMessageDto,
  ): Promise<ChatMessage> {
    if (!data.content || data.content.trim().length === 0) {
      throw new HttpException("Message content cannot be empty", HttpStatus.BAD_REQUEST);
    }

    if (data.content.length > 2000) {
      throw new HttpException("Message content is too long (max 2000 characters)", HttpStatus.BAD_REQUEST);
    }

    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        id: data.chatRoomId,
        participants: { some: { userId } },
      },
      include: {
        order: {
          select: { id: true, status: true },
        },
      },
    });

    if (!chatRoom) {
      throw new HttpException("Chat room not found", HttpStatus.NOT_FOUND);
    }

    const chatAccessError = this.validateChatAccess(
      chatRoom.type,
      chatRoom.order.status,
    );
    if (chatAccessError) {
      throw new HttpException(chatAccessError, HttpStatus.FORBIDDEN);
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        chatRoomId: data.chatRoomId,
        senderId: userId,
        content: data.content.trim(),
        type: data.type || MessageType.TEXT,
      },
    });

    await this.prisma.chatRoom.update({
      where: { id: data.chatRoomId },
      data: { updatedAt: new Date() },
    });

    this.logger.info(
      `Message sent in room ${data.chatRoomId} by user ${userId}`,
    );
    return message;
  }

  async getMessages(
    chatRoomId: string,
    userId: string,
    limit = 50,
    before?: string,
  ): Promise<ChatMessage[]> {
    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        participants: { some: { userId } },
      },
    });

    if (!chatRoom) {
      throw new HttpException("Chat room not found", HttpStatus.NOT_FOUND);
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        sender: {
          select: { id: true, email: true, image: true },
        },
      },
    });

    return messages.reverse();
  }

  async markMessagesAsRead(chatRoomId: string, userId: string): Promise<void> {
    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        participants: { some: { userId } },
      },
    });

    if (!chatRoom) {
      throw new HttpException("Chat room not found", HttpStatus.NOT_FOUND);
    }

    await this.prisma.chatMessage.updateMany({
      where: {
        chatRoomId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    const count = await this.prisma.chatMessage.count({
      where: {
        chatRoom: {
          participants: { some: { userId } },
        },
        senderId: { not: userId },
        isRead: false,
      },
    });
    return count;
  }

  async getChatRoomForOrder(
    orderId: string,
    type: ChatRoomType,
    userId: string,
  ): Promise<(ChatRoom & { isClosed: boolean }) | null> {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        orderId,
        type,
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, email: true, image: true },
            },
          },
        },
        order: {
          select: { id: true, status: true },
        },
      },
    });

    if (!room) return null;

    const isClosed = !!this.validateChatAccess(type, room.order.status);

    return { ...room, isClosed };
  }

  private validateChatAccess(
    type: ChatRoomType,
    orderStatus: string,
  ): string | null {
    const merchantChatStatuses = ["PAID", "PREPARING", "READY"];
    const driverChatStatuses = ["ON_DELIVERY"];

    if (type === ChatRoomType.CUSTOMER_MERCHANT) {
      if (!merchantChatStatuses.includes(orderStatus)) {
        return "Chat with merchant is closed. The order has progressed past the preparation stage.";
      }
    }

    if (type === ChatRoomType.CUSTOMER_DRIVER) {
      if (!driverChatStatuses.includes(orderStatus)) {
        return "Chat with driver is only available when the order is on delivery.";
      }
    }

    return null;
  }

  async getChatStatus(
    orderId: string,
    userId: string,
  ): Promise<{
    canChatWithMerchant: boolean;
    canChatWithDriver: boolean;
    orderStatus: string;
  }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true, driverId: true },
    });

    if (!order) {
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
    }

    const merchantChatStatuses = ["PAID", "PREPARING", "READY"];
    const driverChatStatuses = ["ON_DELIVERY"];

    return {
      canChatWithMerchant: merchantChatStatuses.includes(order.status),
      canChatWithDriver:
        driverChatStatuses.includes(order.status) && !!order.driverId,
      orderStatus: order.status,
    };
  }
}
