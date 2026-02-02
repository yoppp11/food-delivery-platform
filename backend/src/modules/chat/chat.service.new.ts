import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import {
  ChatMessage,
  ChatParticipant,
  ChatRoom,
  ChatRoomType,
  ChatRoomStatus,
  ChatRole,
  MessageType,
  MessageStatus,
  User,
  SupportTicket,
  SupportCategory,
  TicketStatus,
  TicketPriority,
  Prisma,
} from "@prisma/client";
import {
  SendMessageDto,
  CreateSupportTicketDto,
  ChatRoomQueryDto,
  MessageQueryDto,
  TicketQueryDto,
  UpdateTicketDto,
} from "./dto/chat.dto";

export interface ChatRoomWithDetails extends ChatRoom {
  participants: (ChatParticipant & {
    user: Pick<User, "id" | "email" | "image">;
  })[];
  messages: ChatMessage[];
  order?: {
    id: string;
    status: string;
    merchantId?: string;
  } | null;
  ticket?: SupportTicket | null;
  _count?: {
    messages: number;
  };
}

export interface MessageWithSender extends ChatMessage {
  sender: Pick<User, "id" | "email" | "image">;
}

export interface ChatAccessResult {
  canAccess: boolean;
  reason?: string;
  isClosed: boolean;
}

@Injectable()
export class ChatService {
  private readonly DELIVERY_GRACE_PERIOD = 15;

  private readonly messageDeduplicationCache = new Map<string, string>();

  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getChatRoomsForUser(
    userId: string,
    query: ChatRoomQueryDto = {},
  ): Promise<{
    data: ChatRoomWithDetails[];
    meta: { total: number; page: number; limit: number; hasMore: boolean };
  }> {
    const { status, type, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ChatRoomWhereInput = {
      participants: {
        some: {
          userId,
          leftAt: null,
        },
      },
      ...(status && { status }),
      ...(type && { type }),
    };

    const [rooms, total] = await Promise.all([
      this.prisma.chatRoom.findMany({
        where,
        include: {
          participants: {
            where: { leftAt: null },
            include: {
              user: {
                select: { id: true, email: true, image: true },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              sender: {
                select: { id: true, email: true, image: true },
              },
            },
          },
          order: {
            select: { id: true, status: true, merchantId: true },
          },
          ticket: true,
        },
        orderBy: [
          { lastMessageAt: { sort: "desc", nulls: "last" } },
          { updatedAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      this.prisma.chatRoom.count({ where }),
    ]);

    const roomsWithUnread = await Promise.all(
      rooms.map(async (room) => {
        const participant = await this.prisma.chatParticipant.findUnique({
          where: {
            chatRoomId_userId: {
              chatRoomId: room.id,
              userId,
            },
          },
        });

        const unreadCount = await this.prisma.chatMessage.count({
          where: {
            chatRoomId: room.id,
            senderId: { not: userId },
            createdAt: {
              gt: participant?.lastReadAt ?? new Date(0),
            },
            deletedAt: null,
          },
        });

        return {
          ...room,
          unreadCount,
        };
      }),
    );

    return {
      data: roomsWithUnread as unknown as ChatRoomWithDetails[],
      meta: {
        total,
        page,
        limit,
        hasMore: skip + rooms.length < total,
      },
    };
  }

  async getChatRoomById(
    chatRoomId: string,
    userId: string,
  ): Promise<ChatRoomWithDetails | null> {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        participants: {
          some: { userId, leftAt: null },
        },
      },
      include: {
        participants: {
          where: { leftAt: null },
          include: {
            user: {
              select: { id: true, email: true, image: true },
            },
          },
        },
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: { id: true, email: true, image: true },
            },
          },
        },
        order: {
          select: { id: true, status: true, merchantId: true },
        },
        ticket: true,
      },
    });

    return room as unknown as ChatRoomWithDetails | null;
  }

  async getOrCreateChatRoom(
    orderId: string | undefined,
    type: ChatRoomType,
    userId: string,
  ): Promise<ChatRoom> {
    if (type === ChatRoomType.CUSTOMER_SUPPORT && !orderId) {
      throw new HttpException(
        "Use createSupportTicket for support chats without order",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!orderId) {
      throw new HttpException("Order ID is required", HttpStatus.BAD_REQUEST);
    }

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

    const isCustomer = order.userId === userId;
    const isMerchant = order.merchant.user.id === userId;
    const isDriver = order.driver?.user.id === userId;

    if (!isCustomer && !isMerchant && !isDriver) {
      throw new HttpException(
        "You are not authorized to access this chat",
        HttpStatus.FORBIDDEN,
      );
    }

    const orderWithUpdate = order as unknown as {
      status: string;
      updatedAt: Date;
    };
    const accessResult = this.validateChatAccess(type, order.status, {
      updatedAt: orderWithUpdate.updatedAt,
    });
    if (!accessResult.canAccess) {
      throw new HttpException(
        accessResult.reason || "Chat not available",
        HttpStatus.FORBIDDEN,
      );
    }

    const existingRoom = await this.prisma.chatRoom.findFirst({
      where: { orderId, type },
      include: { participants: true },
    });

    if (existingRoom) {
      if (existingRoom.status === ChatRoomStatus.CLOSED) {
        return this.prisma.chatRoom.update({
          where: { id: existingRoom.id },
          data: { status: ChatRoomStatus.ACTIVE },
          include: { participants: true },
        });
      }
      return existingRoom;
    }

    const participantUserIds = this.getParticipantsForChatType(
      type,
      order,
      userId,
    );

    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        orderId,
        type,
        status: ChatRoomStatus.ACTIVE,
        participants: {
          create: participantUserIds.map((p) => ({
            userId: p.id,
            role: p.role,
          })),
        },
      },
      include: { participants: true },
    });

    this.logger.info(`Created chat room ${chatRoom.id} for order ${orderId}`, {
      type,
      participants: participantUserIds.map((p) => p.id),
    });

    return chatRoom;
  }

  async closeChatRoom(
    chatRoomId: string,
    userId: string,
    reason?: string,
  ): Promise<ChatRoom> {
    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        participants: { some: { userId } },
      },
      include: { participants: true },
    });

    if (!room) {
      throw new HttpException("Chat room not found", HttpStatus.NOT_FOUND);
    }

    if (room.status === ChatRoomStatus.CLOSED) {
      throw new HttpException(
        "Chat room is already closed",
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedRoom = await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        status: ChatRoomStatus.CLOSED,
        closedAt: new Date(),
        closedReason: reason,
      },
    });

    await this.createSystemMessage(
      chatRoomId,
      `Chat has been closed${reason ? `: ${reason}` : "."}`,
    );

    this.logger.info(`Chat room ${chatRoomId} closed by user ${userId}`, {
      reason,
    });

    return updatedRoom;
  }

  async sendMessage(
    userId: string,
    data: SendMessageDto,
  ): Promise<MessageWithSender> {
    if (!data.content || data.content.trim().length === 0) {
      throw new HttpException(
        "Message content cannot be empty",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.content.length > 2000) {
      throw new HttpException(
        "Message content is too long (max 2000 characters)",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.clientMessageId) {
      const existingMessageId = this.messageDeduplicationCache.get(
        data.clientMessageId,
      );
      if (existingMessageId) {
        const existingMessage = await this.prisma.chatMessage.findUnique({
          where: { id: existingMessageId },
          include: {
            sender: {
              select: { id: true, email: true, image: true },
            },
          },
        });
        if (existingMessage) {
          return existingMessage as MessageWithSender;
        }
      }
    }

    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        id: data.chatRoomId,
        participants: { some: { userId, leftAt: null } },
      },
      include: {
        order: {
          select: { id: true, status: true },
        },
        participants: true,
      },
    });

    if (!chatRoom) {
      throw new HttpException("Chat room not found", HttpStatus.NOT_FOUND);
    }

    if (chatRoom.status === ChatRoomStatus.CLOSED) {
      throw new HttpException(
        "This chat has been closed",
        HttpStatus.FORBIDDEN,
      );
    }

    if (chatRoom.orderId && chatRoom.order) {
      const accessResult = this.validateChatAccess(
        chatRoom.type,
        chatRoom.order.status,
      );
      if (!accessResult.canAccess) {
        throw new HttpException(
          accessResult.reason || "Chat not available",
          HttpStatus.FORBIDDEN,
        );
      }
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        chatRoomId: data.chatRoomId,
        senderId: userId,
        content: data.content.trim(),
        type: data.type || MessageType.TEXT,
        status: MessageStatus.SENT,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      },
      include: {
        sender: {
          select: { id: true, email: true, image: true },
        },
      },
    });

    await this.prisma.chatRoom.update({
      where: { id: data.chatRoomId },
      data: {
        lastMessageAt: new Date(),
        lastMessageId: message.id,
        updatedAt: new Date(),
      },
    });

    await this.prisma.chatParticipant.update({
      where: {
        chatRoomId_userId: {
          chatRoomId: data.chatRoomId,
          userId,
        },
      },
      data: {
        lastSeenAt: new Date(),
        lastReadAt: new Date(),
        lastReadMsgId: message.id,
      },
    });

    if (data.clientMessageId) {
      this.messageDeduplicationCache.set(data.clientMessageId, message.id);
      setTimeout(
        () => {
          this.messageDeduplicationCache.delete(data.clientMessageId!);
        },
        5 * 60 * 1000,
      );
    }

    this.logger.info(
      `Message sent in room ${data.chatRoomId} by user ${userId}`,
      { messageId: message.id, type: data.type },
    );

    return message as MessageWithSender;
  }

  async getMessages(
    chatRoomId: string,
    userId: string,
    query: MessageQueryDto = {},
  ): Promise<{
    messages: MessageWithSender[];
    hasMore: boolean;
    cursor?: string;
  }> {
    const { limit = 50, before, after } = query;

    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        participants: { some: { userId, leftAt: null } },
      },
    });

    if (!chatRoom) {
      throw new HttpException("Chat room not found", HttpStatus.NOT_FOUND);
    }

    let cursorCondition: Prisma.ChatMessageWhereInput = {};

    if (before) {
      const beforeMessage = await this.prisma.chatMessage.findUnique({
        where: { id: before },
        select: { createdAt: true },
      });
      if (beforeMessage) {
        cursorCondition = {
          createdAt: { lt: beforeMessage.createdAt },
        };
      }
    } else if (after) {
      const afterMessage = await this.prisma.chatMessage.findUnique({
        where: { id: after },
        select: { createdAt: true },
      });
      if (afterMessage) {
        cursorCondition = {
          createdAt: { gt: afterMessage.createdAt },
        };
      }
    }

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId,
        deletedAt: null,
        ...cursorCondition,
      },
      orderBy: { createdAt: after ? "asc" : "desc" },
      take: limit + 1,
      include: {
        sender: {
          select: { id: true, email: true, image: true },
        },
        readReceipts: {
          select: {
            userId: true,
            readAt: true,
          },
        },
      },
    });

    const hasMore = messages.length > limit;
    const resultMessages = hasMore ? messages.slice(0, limit) : messages;

    if (!after) {
      resultMessages.reverse();
    }

    return {
      messages: resultMessages as MessageWithSender[],
      hasMore,
      cursor: hasMore
        ? resultMessages[resultMessages.length - 1]?.id
        : undefined,
    };
  }

  async markMessagesAsRead(
    chatRoomId: string,
    userId: string,
    lastReadMessageId?: string,
  ): Promise<{ success: boolean; markedCount: number }> {
    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        participants: { some: { userId, leftAt: null } },
      },
    });

    if (!chatRoom) {
      throw new HttpException("Chat room not found", HttpStatus.NOT_FOUND);
    }

    let upToDate: Date;
    if (lastReadMessageId) {
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: lastReadMessageId },
        select: { createdAt: true },
      });
      if (!message) {
        throw new HttpException("Message not found", HttpStatus.NOT_FOUND);
      }
      upToDate = message.createdAt;
    } else {
      upToDate = new Date();
    }

    await this.prisma.chatParticipant.update({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
      },
      data: {
        lastReadAt: upToDate,
        lastReadMsgId: lastReadMessageId,
        lastSeenAt: new Date(),
      },
    });

    const unreadMessages = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId,
        senderId: { not: userId },
        createdAt: { lte: upToDate },
        readReceipts: {
          none: { userId },
        },
      },
      select: { id: true },
    });

    if (unreadMessages.length > 0) {
      await this.prisma.messageReadReceipt.createMany({
        data: unreadMessages.map((msg) => ({
          messageId: msg.id,
          userId,
        })),
        skipDuplicates: true,
      });

      for (const msg of unreadMessages) {
        await this.updateMessageStatus(msg.id, chatRoomId);
      }
    }

    await this.prisma.chatMessage.updateMany({
      where: {
        chatRoomId,
        senderId: { not: userId },
        createdAt: { lte: upToDate },
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true, markedCount: unreadMessages.length };
  }

  async updateMessageStatus(
    messageId: string,
    chatRoomId: string,
  ): Promise<void> {
    const [participantCount, receiptCount] = await Promise.all([
      this.prisma.chatParticipant.count({
        where: { chatRoomId, leftAt: null },
      }),
      this.prisma.messageReadReceipt.count({
        where: { messageId },
      }),
    ]);

    if (receiptCount >= participantCount - 1) {
      await this.prisma.chatMessage.update({
        where: { id: messageId },
        data: { status: MessageStatus.READ },
      });
    } else if (receiptCount > 0) {
      await this.prisma.chatMessage.update({
        where: { id: messageId },
        data: { status: MessageStatus.DELIVERED },
      });
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    const participations = await this.prisma.chatParticipant.findMany({
      where: {
        userId,
        leftAt: null,
        chatRoom: {
          status: { not: ChatRoomStatus.ARCHIVED },
        },
      },
      select: {
        chatRoomId: true,
        lastReadAt: true,
      },
    });

    let totalUnread = 0;
    for (const participation of participations) {
      const count = await this.prisma.chatMessage.count({
        where: {
          chatRoomId: participation.chatRoomId,
          senderId: { not: userId },
          createdAt: {
            gt: participation.lastReadAt ?? new Date(0),
          },
          deletedAt: null,
        },
      });
      totalUnread += count;
    }

    return totalUnread;
  }

  async createSupportTicket(
    userId: string,
    data: CreateSupportTicketDto,
  ): Promise<{ ticket: SupportTicket; chatRoom: ChatRoom }> {
    const ticket = await this.prisma.supportTicket.create({
      data: {
        customerId: userId,
        subject: data.subject,
        category: data.category || SupportCategory.GENERAL,
        priority: TicketPriority.NORMAL,
        status: TicketStatus.OPEN,
      },
    });

    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        ticketId: ticket.id,
        type: ChatRoomType.CUSTOMER_SUPPORT,
        status: ChatRoomStatus.ACTIVE,
        title: data.subject,
        participants: {
          create: {
            userId,
            role: ChatRole.CUSTOMER,
          },
        },
      },
      include: { participants: true },
    });

    await this.createSystemMessage(
      chatRoom.id,
      `Support ticket #${ticket.id.substring(0, 8)} created. Subject: ${data.subject}. Category: ${data.category || "General"}. A support agent will join shortly.`,
    );

    if (data.initialMessage) {
      await this.sendMessage(userId, {
        chatRoomId: chatRoom.id,
        content: data.initialMessage,
        type: MessageType.TEXT,
      });
    }

    this.logger.info(`Support ticket ${ticket.id} created by user ${userId}`, {
      subject: data.subject,
      category: data.category,
    });

    return { ticket, chatRoom };
  }

  async getSupportTickets(
    query: TicketQueryDto = {},
  ): Promise<{
    data: SupportTicket[];
    meta: { total: number; page: number; limit: number; hasMore: boolean };
  }> {
    const {
      status,
      category,
      priority,
      assignedTo,
      page = 1,
      limit = 20,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.SupportTicketWhereInput = {
      ...(status && { status: status as TicketStatus }),
      ...(category && { category }),
      ...(priority && { priority }),
      ...(assignedTo && { assignedAdminId: assignedTo }),
    };

    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where,
        include: {
          customer: {
            select: { id: true, email: true, image: true },
          },
          assignedAdmin: {
            select: { id: true, email: true, image: true },
          },
          chatRoom: {
            select: { id: true, status: true, lastMessageAt: true },
          },
        },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      this.prisma.supportTicket.count({ where }),
    ]);

    return {
      data: tickets,
      meta: {
        total,
        page,
        limit,
        hasMore: skip + tickets.length < total,
      },
    };
  }

  async assignTicket(
    ticketId: string,
    adminId: string,
    assignedBy: string,
  ): Promise<SupportTicket> {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { chatRoom: true },
    });

    if (!ticket) {
      throw new HttpException("Ticket not found", HttpStatus.NOT_FOUND);
    }

    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { id: true, role: true, email: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      throw new HttpException("Invalid admin user", HttpStatus.BAD_REQUEST);
    }

    const updatedTicket = await this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        assignedAdminId: adminId,
        status: TicketStatus.IN_PROGRESS,
      },
    });

    if (ticket.chatRoom) {
      const existingParticipant = await this.prisma.chatParticipant.findUnique({
        where: {
          chatRoomId_userId: {
            chatRoomId: ticket.chatRoom.id,
            userId: adminId,
          },
        },
      });

      if (!existingParticipant) {
        await this.prisma.chatParticipant.create({
          data: {
            chatRoomId: ticket.chatRoom.id,
            userId: adminId,
            role: ChatRole.ADMIN,
          },
        });

        await this.createSystemMessage(
          ticket.chatRoom.id,
          `Support agent ${admin.email} has joined the chat.`,
        );
      }
    }

    this.logger.info(
      `Ticket ${ticketId} assigned to admin ${adminId} by ${assignedBy}`,
    );

    return updatedTicket;
  }

  async updateTicket(
    ticketId: string,
    adminId: string,
    data: UpdateTicketDto,
  ): Promise<SupportTicket> {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { chatRoom: true },
    });

    if (!ticket) {
      throw new HttpException("Ticket not found", HttpStatus.NOT_FOUND);
    }

    const updateData: Prisma.SupportTicketUpdateInput = {};

    if (data.priority) {
      updateData.priority = data.priority;
    }

    if (data.status) {
      updateData.status = data.status as TicketStatus;

      if (data.status === "RESOLVED" || data.status === "CLOSED") {
        updateData.resolvedAt = new Date();

        if (ticket.chatRoom) {
          await this.closeChatRoom(
            ticket.chatRoom.id,
            adminId,
            data.resolution || `Ticket ${data.status.toLowerCase()}`,
          );
        }
      }
    }

    if (data.resolution) {
      updateData.resolution = data.resolution;
    }

    const updatedTicket = await this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
    });

    if (
      (data.status === "RESOLVED" || data.status === "CLOSED") &&
      ticket.chatRoom
    ) {
      await this.createSystemMessage(
        ticket.chatRoom.id,
        `Ticket resolved: ${data.resolution || "Issue has been addressed."}`,
      );
    }

    this.logger.info(`Ticket ${ticketId} updated by admin ${adminId}`, data);

    return updatedTicket;
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
        participants: { some: { userId, leftAt: null } },
      },
      include: {
        participants: {
          where: { leftAt: null },
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

    const accessResult = this.validateChatAccess(
      type,
      room.order?.status || "",
    );

    return {
      ...room,
      isClosed:
        !accessResult.canAccess || room.status === ChatRoomStatus.CLOSED,
    };
  }

  async getChatStatus(
    orderId: string,
    userId: string,
  ): Promise<{
    canChatWithMerchant: boolean;
    canChatWithDriver: boolean;
    orderStatus: string;
    merchantChatRoomId?: string;
    driverChatRoomId?: string;
  }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        status: true,
        driverId: true,
        userId: true,
        merchant: {
          select: { ownerId: true },
        },
      },
    });

    if (!order) {
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
    }

    const [merchantRoom, driverRoom] = await Promise.all([
      this.prisma.chatRoom.findFirst({
        where: { orderId, type: ChatRoomType.CUSTOMER_MERCHANT },
        select: { id: true, status: true },
      }),
      this.prisma.chatRoom.findFirst({
        where: { orderId, type: ChatRoomType.CUSTOMER_DRIVER },
        select: { id: true, status: true },
      }),
    ]);

    const merchantAccess = this.validateChatAccess(
      ChatRoomType.CUSTOMER_MERCHANT,
      order.status,
    );
    const driverAccess = this.validateChatAccess(
      ChatRoomType.CUSTOMER_DRIVER,
      order.status,
    );

    return {
      canChatWithMerchant:
        merchantAccess.canAccess &&
        merchantRoom?.status !== ChatRoomStatus.CLOSED,
      canChatWithDriver:
        driverAccess.canAccess &&
        !!order.driverId &&
        driverRoom?.status !== ChatRoomStatus.CLOSED,
      orderStatus: order.status,
      merchantChatRoomId: merchantRoom?.id,
      driverChatRoomId: driverRoom?.id,
    };
  }

  private validateChatAccess(
    type: ChatRoomType,
    orderStatus: string,
    order?: { updatedAt?: Date },
  ): ChatAccessResult {
    const merchantChatStatuses = ["PAID", "PREPARING", "READY"];
    const driverChatStatuses = ["ON_DELIVERY"];

    if (type === ChatRoomType.CUSTOMER_MERCHANT) {
      if (!merchantChatStatuses.includes(orderStatus)) {
        return {
          canAccess: false,
          reason:
            "Chat with merchant is closed. The order has progressed past the preparation stage.",
          isClosed: true,
        };
      }
    }

    if (type === ChatRoomType.CUSTOMER_DRIVER) {
      if (!driverChatStatuses.includes(orderStatus)) {
        if (orderStatus === "COMPLETED" && order?.updatedAt) {
          const gracePeriodEnd = new Date(
            order.updatedAt.getTime() + this.DELIVERY_GRACE_PERIOD * 60 * 1000,
          );
          if (new Date() <= gracePeriodEnd) {
            return { canAccess: true, isClosed: false };
          }
        }
        return {
          canAccess: false,
          reason: "Chat with driver is only available during delivery.",
          isClosed: true,
        };
      }
    }

    if (type === ChatRoomType.CUSTOMER_SUPPORT) {
      return { canAccess: true, isClosed: false };
    }

    return { canAccess: true, isClosed: false };
  }

  private getParticipantsForChatType(
    type: ChatRoomType,
    order: {
      userId: string;
      merchant: { user: { id: string } };
      driver?: { user: { id: string } } | null;
    },
    userId: string,
  ): Array<{ id: string; role: ChatRole }> {
    switch (type) {
      case ChatRoomType.CUSTOMER_MERCHANT:
        return [
          { id: order.userId, role: ChatRole.CUSTOMER },
          { id: order.merchant.user.id, role: ChatRole.MERCHANT },
        ];

      case ChatRoomType.CUSTOMER_DRIVER:
        if (!order.driver) {
          throw new HttpException(
            "Driver not assigned",
            HttpStatus.BAD_REQUEST,
          );
        }
        return [
          { id: order.userId, role: ChatRole.CUSTOMER },
          { id: order.driver.user.id, role: ChatRole.DRIVER },
        ];

      case ChatRoomType.CUSTOMER_SUPPORT:
        return [{ id: order.userId, role: ChatRole.CUSTOMER }];

      default:
        return [{ id: userId, role: ChatRole.CUSTOMER }];
    }
  }

  private async createSystemMessage(
    chatRoomId: string,
    content: string,
  ): Promise<ChatMessage> {
    const message = await this.prisma.chatMessage.create({
      data: {
        chatRoomId,
        senderId: "system",
        content,
        type: MessageType.SYSTEM,
        status: MessageStatus.SENT,
      },
    });

    await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        lastMessageAt: new Date(),
        lastMessageId: message.id,
      },
    });

    return message;
  }

  async markMessagesAsReadLegacy(
    chatRoomId: string,
    userId: string,
  ): Promise<void> {
    await this.markMessagesAsRead(chatRoomId, userId);
  }
}
