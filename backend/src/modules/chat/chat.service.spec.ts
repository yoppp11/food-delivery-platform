import { Test, TestingModule } from "@nestjs/testing";
import { ChatService } from "./chat.service.new";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { HttpException, HttpStatus } from "@nestjs/common";
import {
  ChatRoomType,
  ChatRoomStatus,
  MessageType,
  MessageStatus,
  SupportCategory,
  TicketStatus,
  TicketPriority,
  ChatRole,
} from "@prisma/client";

const mockUser = {
  id: "user-123",
  email: "customer@test.com",
  image: null,
  role: "CUSTOMER",
};

const mockMerchantUser = {
  id: "merchant-user-123",
  email: "merchant@test.com",
  image: null,
  role: "MERCHANT",
};

const mockDriverUser = {
  id: "driver-user-123",
  email: "driver@test.com",
  image: null,
  role: "DRIVER",
};

const mockAdminUser = {
  id: "admin-123",
  email: "admin@test.com",
  image: null,
  role: "ADMIN",
};

const mockOrder = {
  id: "order-123",
  userId: mockUser.id,
  merchantId: "merchant-123",
  status: "PREPARING",
  merchant: {
    id: "merchant-123",
    user: mockMerchantUser,
  },
  driver: {
    id: "driver-123",
    user: mockDriverUser,
  },
  updatedAt: new Date(),
};

const mockChatRoom = {
  id: "room-123",
  orderId: mockOrder.id,
  type: ChatRoomType.CUSTOMER_MERCHANT,
  status: ChatRoomStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastMessageAt: null,
  lastMessageId: null,
  ticketId: null,
  title: null,
  closedAt: null,
  closedReason: null,
  participants: [
    { userId: mockUser.id, role: ChatRole.CUSTOMER, leftAt: null, user: mockUser },
    { userId: mockMerchantUser.id, role: ChatRole.MERCHANT, leftAt: null, user: mockMerchantUser },
  ],
  messages: [],
  order: { id: mockOrder.id, status: "PREPARING" },
};

const mockMessage = {
  id: "message-123",
  chatRoomId: mockChatRoom.id,
  senderId: mockUser.id,
  content: "Hello, merchant!",
  type: MessageType.TEXT,
  status: MessageStatus.SENT,
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  metadata: null,
  replyToId: null,
  deletedAt: null,
  deletedBy: null,
  sender: mockUser,
};

const mockSupportTicket = {
  id: "ticket-123",
  customerId: mockUser.id,
  subject: "Order Issue",
  category: SupportCategory.ORDER_ISSUE,
  priority: TicketPriority.NORMAL,
  status: TicketStatus.OPEN,
  assignedAdminId: null,
  resolvedAt: null,
  resolution: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const mockPrismaService = {
  chatRoom: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  chatParticipant: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  chatMessage: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
  messageReadReceipt: {
    createMany: jest.fn(),
    count: jest.fn(),
  },
  order: {
    findUnique: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  supportTicket: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

describe("ChatService", () => {
  let service: ChatService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prisma = mockPrismaService;

    jest.clearAllMocks();
  });

  describe("getChatRoomsForUser", () => {
    it("should return paginated chat rooms for a user", async () => {
      prisma.chatRoom.findMany.mockResolvedValue([mockChatRoom]);
      prisma.chatRoom.count.mockResolvedValue(1);
      prisma.chatParticipant.findUnique.mockResolvedValue({
        lastReadAt: new Date(),
      });
      prisma.chatMessage.count.mockResolvedValue(0);

      const result = await service.getChatRoomsForUser(mockUser.id, {
        page: 1,
        limit: 20,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.hasMore).toBe(false);
      expect(prisma.chatRoom.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            participants: expect.objectContaining({
              some: { userId: mockUser.id, leftAt: null },
            }),
          }),
        })
      );
    });

    it("should filter by status when provided", async () => {
      prisma.chatRoom.findMany.mockResolvedValue([]);
      prisma.chatRoom.count.mockResolvedValue(0);

      await service.getChatRoomsForUser(mockUser.id, {
        status: ChatRoomStatus.ACTIVE,
        page: 1,
        limit: 20,
      });

      expect(prisma.chatRoom.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: ChatRoomStatus.ACTIVE,
          }),
        })
      );
    });

    it("should filter by type when provided", async () => {
      prisma.chatRoom.findMany.mockResolvedValue([]);
      prisma.chatRoom.count.mockResolvedValue(0);

      await service.getChatRoomsForUser(mockUser.id, {
        type: ChatRoomType.CUSTOMER_MERCHANT,
        page: 1,
        limit: 20,
      });

      expect(prisma.chatRoom.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: ChatRoomType.CUSTOMER_MERCHANT,
          }),
        })
      );
    });
  });

  describe("getChatRoomById", () => {
    it("should return chat room when user is a participant", async () => {
      prisma.chatRoom.findFirst.mockResolvedValue(mockChatRoom);

      const result = await service.getChatRoomById(mockChatRoom.id, mockUser.id);

      expect(result).toEqual(mockChatRoom);
      expect(prisma.chatRoom.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: mockChatRoom.id,
            participants: expect.objectContaining({
              some: { userId: mockUser.id, leftAt: null },
            }),
          }),
        })
      );
    });

    it("should return null when user is not a participant", async () => {
      prisma.chatRoom.findFirst.mockResolvedValue(null);

      const result = await service.getChatRoomById(mockChatRoom.id, "other-user");

      expect(result).toBeNull();
    });
  });

  describe("getOrCreateChatRoom", () => {
    it("should return existing chat room if one exists", async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      prisma.chatRoom.findFirst.mockResolvedValue(mockChatRoom);

      const result = await service.getOrCreateChatRoom(
        mockOrder.id,
        ChatRoomType.CUSTOMER_MERCHANT,
        mockUser.id
      );

      expect(result).toEqual(mockChatRoom);
      expect(prisma.chatRoom.create).not.toHaveBeenCalled();
    });

    it("should create a new chat room when none exists", async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      prisma.chatRoom.findFirst.mockResolvedValue(null);
      prisma.chatRoom.create.mockResolvedValue(mockChatRoom);

      const result = await service.getOrCreateChatRoom(
        mockOrder.id,
        ChatRoomType.CUSTOMER_MERCHANT,
        mockUser.id
      );

      expect(result).toEqual(mockChatRoom);
      expect(prisma.chatRoom.create).toHaveBeenCalled();
    });

    it("should throw error when order not found", async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(
        service.getOrCreateChatRoom(
          "non-existent",
          ChatRoomType.CUSTOMER_MERCHANT,
          mockUser.id
        )
      ).rejects.toThrow(new HttpException("Order not found", HttpStatus.NOT_FOUND));
    });

    it("should throw error for CUSTOMER_DRIVER when order status doesn't allow driver chat", async () => {
      const orderWithoutDriver = { ...mockOrder, driver: null, status: "PREPARING" };
      prisma.order.findUnique.mockResolvedValue(orderWithoutDriver);
      prisma.chatRoom.findFirst.mockResolvedValue(null);

      await expect(
        service.getOrCreateChatRoom(
          mockOrder.id,
          ChatRoomType.CUSTOMER_DRIVER,
          mockUser.id
        )
      ).rejects.toThrow(new HttpException("Chat with driver is only available during delivery.", HttpStatus.FORBIDDEN));
    });

    it("should throw error when user is not authorized", async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      prisma.chatRoom.findFirst.mockResolvedValue(null);

      await expect(
        service.getOrCreateChatRoom(
          mockOrder.id,
          ChatRoomType.CUSTOMER_MERCHANT,
          "unauthorized-user"
        )
      ).rejects.toThrow(
        new HttpException("You are not authorized to access this chat", HttpStatus.FORBIDDEN)
      );
    });

    it("should throw error when order status doesn't allow chat", async () => {
      const deliveredOrder = { ...mockOrder, status: "DELIVERED" };
      prisma.order.findUnique.mockResolvedValue(deliveredOrder);
      prisma.chatRoom.findFirst.mockResolvedValue(null);

      await expect(
        service.getOrCreateChatRoom(
          mockOrder.id,
          ChatRoomType.CUSTOMER_MERCHANT,
          mockUser.id
        )
      ).rejects.toThrow(HttpException);
    });
  });

  describe("sendMessage", () => {
    beforeEach(() => {
      prisma.chatRoom.findFirst.mockResolvedValue({
        ...mockChatRoom,
        order: { id: mockOrder.id, status: "PREPARING" },
      });
      prisma.chatMessage.create.mockResolvedValue(mockMessage);
      prisma.chatRoom.update.mockResolvedValue(mockChatRoom);
      prisma.chatParticipant.update.mockResolvedValue({});
    });

    it("should create a message with SENT status", async () => {
      const result = await service.sendMessage(mockUser.id, {
        chatRoomId: mockChatRoom.id,
        content: "Hello!",
        type: MessageType.TEXT,
      });

      expect(result).toEqual(mockMessage);
      expect(prisma.chatMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: MessageStatus.SENT,
          }),
        })
      );
    });

    it("should update chatRoom.lastMessageAt", async () => {
      await service.sendMessage(mockUser.id, {
        chatRoomId: mockChatRoom.id,
        content: "Hello!",
      });

      expect(prisma.chatRoom.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockChatRoom.id },
          data: expect.objectContaining({
            lastMessageAt: expect.any(Date),
            lastMessageId: mockMessage.id,
          }),
        })
      );
    });

    it("should reject empty content", async () => {
      await expect(
        service.sendMessage(mockUser.id, {
          chatRoomId: mockChatRoom.id,
          content: "",
        })
      ).rejects.toThrow(
        new HttpException("Message content cannot be empty", HttpStatus.BAD_REQUEST)
      );
    });

    it("should reject whitespace-only content", async () => {
      await expect(
        service.sendMessage(mockUser.id, {
          chatRoomId: mockChatRoom.id,
          content: "   ",
        })
      ).rejects.toThrow(
        new HttpException("Message content cannot be empty", HttpStatus.BAD_REQUEST)
      );
    });

    it("should reject content longer than 2000 characters", async () => {
      const longContent = "a".repeat(2001);

      await expect(
        service.sendMessage(mockUser.id, {
          chatRoomId: mockChatRoom.id,
          content: longContent,
        })
      ).rejects.toThrow(
        new HttpException(
          "Message content is too long (max 2000 characters)",
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it("should reject if chat room is closed", async () => {
      prisma.chatRoom.findFirst.mockResolvedValue({
        ...mockChatRoom,
        status: ChatRoomStatus.CLOSED,
        order: { id: mockOrder.id, status: "PREPARING" },
      });

      await expect(
        service.sendMessage(mockUser.id, {
          chatRoomId: mockChatRoom.id,
          content: "Hello!",
        })
      ).rejects.toThrow(
        new HttpException("This chat has been closed", HttpStatus.FORBIDDEN)
      );
    });

    it("should handle duplicate clientMessageId (deduplication)", async () => {
      await service.sendMessage(mockUser.id, {
        chatRoomId: mockChatRoom.id,
        content: "Hello!",
        clientMessageId: "client-msg-123",
      });

      prisma.chatMessage.findUnique.mockResolvedValue(mockMessage);

      const result = await service.sendMessage(mockUser.id, {
        chatRoomId: mockChatRoom.id,
        content: "Hello!",
        clientMessageId: "client-msg-123",
      });

      expect(result).toEqual(mockMessage);
    });
  });

  describe("getMessages", () => {
    beforeEach(() => {
      prisma.chatRoom.findFirst.mockResolvedValue(mockChatRoom);
    });

    it("should return messages ordered by createdAt", async () => {
      const messages = [mockMessage];
      prisma.chatMessage.findMany.mockResolvedValue(messages);

      const result = await service.getMessages(mockChatRoom.id, mockUser.id, {
        limit: 50,
      });

      expect(result.messages).toEqual(messages);
      expect(result.hasMore).toBe(false);
    });

    it("should support cursor-based pagination with before parameter", async () => {
      const beforeMessage = { ...mockMessage, id: "msg-before", createdAt: new Date() };
      prisma.chatMessage.findUnique.mockResolvedValue(beforeMessage);
      prisma.chatMessage.findMany.mockResolvedValue([mockMessage]);

      await service.getMessages(mockChatRoom.id, mockUser.id, {
        limit: 50,
        before: "msg-before",
      });

      expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.objectContaining({
              lt: beforeMessage.createdAt,
            }),
          }),
        })
      );
    });

    it("should indicate hasMore when more messages exist", async () => {
      const manyMessages = Array(51).fill(mockMessage);
      prisma.chatMessage.findMany.mockResolvedValue(manyMessages);

      const result = await service.getMessages(mockChatRoom.id, mockUser.id, {
        limit: 50,
      });

      expect(result.hasMore).toBe(true);
      expect(result.messages).toHaveLength(50);
    });

    it("should throw error if room not found", async () => {
      prisma.chatRoom.findFirst.mockResolvedValue(null);

      await expect(
        service.getMessages("non-existent", mockUser.id, { limit: 50 })
      ).rejects.toThrow(new HttpException("Chat room not found", HttpStatus.NOT_FOUND));
    });
  });

  describe("markMessagesAsRead", () => {
    beforeEach(() => {
      prisma.chatRoom.findFirst.mockResolvedValue(mockChatRoom);
      prisma.chatParticipant.update.mockResolvedValue({});
      prisma.chatMessage.findMany.mockResolvedValue([]);
      prisma.messageReadReceipt.createMany.mockResolvedValue({ count: 0 });
      prisma.chatMessage.updateMany.mockResolvedValue({ count: 0 });
    });

    it("should create read receipts for unread messages", async () => {
      const unreadMessages = [{ id: "unread-1" }, { id: "unread-2" }];
      prisma.chatMessage.findMany.mockResolvedValue(unreadMessages);
      prisma.messageReadReceipt.createMany.mockResolvedValue({ count: 2 });
      prisma.chatParticipant.count.mockResolvedValue(2);
      prisma.messageReadReceipt.count.mockResolvedValue(1);
      prisma.chatMessage.update.mockResolvedValue({});

      const result = await service.markMessagesAsRead(mockChatRoom.id, mockUser.id);

      expect(result.success).toBe(true);
      expect(result.markedCount).toBe(2);
      expect(prisma.messageReadReceipt.createMany).toHaveBeenCalled();
    });

    it("should update participant.lastReadAt", async () => {
      await service.markMessagesAsRead(mockChatRoom.id, mockUser.id);

      expect(prisma.chatParticipant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            lastReadAt: expect.any(Date),
            lastSeenAt: expect.any(Date),
          }),
        })
      );
    });
  });

  describe("closeChatRoom", () => {
    beforeEach(() => {
      prisma.chatRoom.findFirst.mockResolvedValue(mockChatRoom);
      prisma.chatRoom.update.mockResolvedValue({
        ...mockChatRoom,
        status: ChatRoomStatus.CLOSED,
      });
      prisma.chatMessage.create.mockResolvedValue({
        ...mockMessage,
        type: MessageType.SYSTEM,
        content: "Chat has been closed.",
      });
    });

    it("should close an active chat room", async () => {
      const result = await service.closeChatRoom(
        mockChatRoom.id,
        mockUser.id,
        "Resolved"
      );

      expect(result.status).toBe(ChatRoomStatus.CLOSED);
      expect(prisma.chatRoom.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: ChatRoomStatus.CLOSED,
            closedAt: expect.any(Date),
            closedReason: "Resolved",
          }),
        })
      );
    });

    it("should throw error if room already closed", async () => {
      prisma.chatRoom.findFirst.mockResolvedValue({
        ...mockChatRoom,
        status: ChatRoomStatus.CLOSED,
      });

      await expect(
        service.closeChatRoom(mockChatRoom.id, mockUser.id)
      ).rejects.toThrow(
        new HttpException("Chat room is already closed", HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe("createSupportTicket", () => {
    beforeEach(() => {
      prisma.supportTicket.create.mockResolvedValue(mockSupportTicket);
      prisma.chatRoom.create.mockResolvedValue({
        ...mockChatRoom,
        type: ChatRoomType.CUSTOMER_SUPPORT,
        ticketId: mockSupportTicket.id,
      });
      prisma.chatMessage.create.mockResolvedValue({
        ...mockMessage,
        type: MessageType.SYSTEM,
      });
      prisma.chatRoom.update.mockResolvedValue({});
      prisma.chatParticipant.update.mockResolvedValue({});
    });

    it("should create support ticket with chat room", async () => {
      const result = await service.createSupportTicket(mockUser.id, {
        subject: "Order Issue",
        category: SupportCategory.ORDER_ISSUE,
      });

      expect(result.ticket).toEqual(mockSupportTicket);
      expect(result.chatRoom.type).toBe(ChatRoomType.CUSTOMER_SUPPORT);
      expect(prisma.supportTicket.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customerId: mockUser.id,
            subject: "Order Issue",
            category: SupportCategory.ORDER_ISSUE,
          }),
        })
      );
    });

    it("should send initial message if provided", async () => {
      prisma.chatRoom.findFirst.mockResolvedValue({
        ...mockChatRoom,
        type: ChatRoomType.CUSTOMER_SUPPORT,
        order: null,
      });

      await service.createSupportTicket(mockUser.id, {
        subject: "Help needed",
        initialMessage: "I need assistance",
      });

      expect(prisma.chatMessage.create).toHaveBeenCalled();
    });
  });

  describe("assignTicket", () => {
    beforeEach(() => {
      prisma.supportTicket.findUnique.mockResolvedValue({
        ...mockSupportTicket,
        chatRoom: { id: "support-room-123" },
      });
      prisma.user.findUnique.mockResolvedValue(mockAdminUser);
      prisma.supportTicket.update.mockResolvedValue({
        ...mockSupportTicket,
        assignedAdminId: mockAdminUser.id,
        status: TicketStatus.IN_PROGRESS,
      });
      prisma.chatParticipant.findUnique.mockResolvedValue(null);
      prisma.chatParticipant.create.mockResolvedValue({});
      prisma.chatMessage.create.mockResolvedValue({
        ...mockMessage,
        type: MessageType.SYSTEM,
      });
      prisma.chatRoom.update.mockResolvedValue({});
    });

    it("should assign ticket to admin", async () => {
      const result = await service.assignTicket(
        mockSupportTicket.id,
        mockAdminUser.id,
        mockAdminUser.id
      );

      expect(result.assignedAdminId).toBe(mockAdminUser.id);
      expect(result.status).toBe(TicketStatus.IN_PROGRESS);
    });

    it("should add admin as participant to chat room", async () => {
      await service.assignTicket(
        mockSupportTicket.id,
        mockAdminUser.id,
        mockAdminUser.id
      );

      expect(prisma.chatParticipant.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: mockAdminUser.id,
            role: ChatRole.ADMIN,
          }),
        })
      );
    });

    it("should throw error if ticket not found", async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(null);

      await expect(
        service.assignTicket("non-existent", mockAdminUser.id, mockAdminUser.id)
      ).rejects.toThrow(new HttpException("Ticket not found", HttpStatus.NOT_FOUND));
    });

    it("should throw error if user is not admin", async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, role: "CUSTOMER" });

      await expect(
        service.assignTicket(mockSupportTicket.id, mockUser.id, mockUser.id)
      ).rejects.toThrow(
        new HttpException("Invalid admin user", HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe("getChatStatus", () => {
    it("should return chat availability for order", async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: "PREPARING",
        merchant: { ownerId: mockMerchantUser.id },
      });
      prisma.chatRoom.findFirst.mockResolvedValue(mockChatRoom);

      const result = await service.getChatStatus(mockOrder.id, mockUser.id);

      expect(result.canChatWithMerchant).toBe(true);
      expect(result.canChatWithDriver).toBe(false);
      expect(result.orderStatus).toBe("PREPARING");
    });

    it("should indicate driver chat available when ON_DELIVERY", async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: "ON_DELIVERY",
        driverId: mockDriverUser.id,
        merchant: { ownerId: mockMerchantUser.id },
      });
      prisma.chatRoom.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({
        ...mockChatRoom,
        type: ChatRoomType.CUSTOMER_DRIVER,
      });

      const result = await service.getChatStatus(mockOrder.id, mockUser.id);

      expect(result.canChatWithMerchant).toBe(false);
      expect(result.canChatWithDriver).toBe(true);
    });

    it("should throw error if order not found", async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(
        service.getChatStatus("non-existent", mockUser.id)
      ).rejects.toThrow(new HttpException("Order not found", HttpStatus.NOT_FOUND));
    });
  });

  describe("getUnreadCount", () => {
    it("should return total unread count across all rooms", async () => {
      prisma.chatParticipant.findMany.mockResolvedValue([
        { chatRoomId: "room-1", lastReadAt: new Date(Date.now() - 3600000) },
        { chatRoomId: "room-2", lastReadAt: new Date(Date.now() - 3600000) },
      ]);
      prisma.chatMessage.count.mockResolvedValue(3);

      const result = await service.getUnreadCount(mockUser.id);

      expect(result).toBe(6);
    });

    it("should return 0 when no unread messages", async () => {
      prisma.chatParticipant.findMany.mockResolvedValue([]);

      const result = await service.getUnreadCount(mockUser.id);

      expect(result).toBe(0);
    });
  });
});
