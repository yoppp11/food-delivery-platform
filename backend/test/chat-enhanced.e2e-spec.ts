import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { TestAppModule } from "./test-app.module";
import { PrismaService } from "../src/common/prisma.service";

describe("Enhanced Chat API (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let testCustomer: any;
  let testMerchantOwner: any;
  let testMerchant: any;
  let testDriverUser: any;
  let testDriver: any;
  let testAdmin: any;
  let testOrder: any;
  let merchantChatRoom: any;
  let driverChatRoom: any;
  let supportTicket: any;
  let supportChatRoom: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    testCustomer = await prisma.user.create({
      data: {
        id: "enhanced-chat-customer",
        email: "enhanced-customer@test.com",
        emailVerified: false,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    testMerchantOwner = await prisma.user.create({
      data: {
        id: "enhanced-chat-merchant-owner",
        email: "enhanced-merchant@test.com",
        emailVerified: false,
        role: "MERCHANT",
        status: "ACTIVE",
      },
    });

    testDriverUser = await prisma.user.create({
      data: {
        id: "enhanced-chat-driver-user",
        email: "enhanced-driver@test.com",
        emailVerified: false,
        role: "DRIVER",
        status: "ACTIVE",
      },
    });

    testAdmin = await prisma.user.create({
      data: {
        id: "enhanced-chat-admin",
        email: "enhanced-admin@test.com",
        emailVerified: false,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    testMerchant = await prisma.merchant.create({
      data: {
        id: "enhanced-chat-merchant",
        ownerId: testMerchantOwner.id,
        name: "Enhanced Chat Test Restaurant",
        latitude: -6.2088,
        longitude: 106.8456,
        isOpen: true,
        approvalStatus: "APPROVED",
      },
    });

    testDriver = await prisma.driver.create({
      data: {
        id: "enhanced-chat-driver",
        userId: testDriverUser.id,
        plateNumber: "AB1234CD",
        isAvailable: true,
        approvalStatus: "APPROVED",
      },
    });

    testOrder = await prisma.order.create({
      data: {
        id: "enhanced-chat-order",
        userId: testCustomer.id,
        merchantId: testMerchant.id,
        driverId: testDriver.id,
        status: "PREPARING",
        totalPrice: 50000,
        paymentStatus: "SUCCESS",
      },
    });
  });

  afterAll(async () => {
    try {
      await prisma.messageReadReceipt.deleteMany({});
      await prisma.chatMessage.deleteMany({
        where: {
          OR: [
            { chatRoom: { orderId: testOrder?.id } },
            { chatRoom: { ticketId: supportTicket?.id } },
          ],
        },
      });
      await prisma.chatParticipant.deleteMany({
        where: {
          OR: [
            { chatRoom: { orderId: testOrder?.id } },
            { chatRoom: { ticketId: supportTicket?.id } },
          ],
        },
      });
      await prisma.chatRoom.deleteMany({
        where: {
          OR: [
            { orderId: testOrder?.id },
            { ticketId: supportTicket?.id },
          ],
        },
      });
      await prisma.supportTicket.deleteMany({
        where: { customerId: testCustomer?.id },
      });
      await prisma.order.deleteMany({ where: { id: testOrder?.id } });
      await prisma.driver.deleteMany({ where: { id: testDriver?.id } });
      await prisma.merchant.deleteMany({ where: { id: testMerchant?.id } });
      await prisma.user.deleteMany({
        where: {
          id: {
            in: [
              "enhanced-chat-customer",
              "enhanced-chat-merchant-owner",
              "enhanced-chat-driver-user",
              "enhanced-chat-admin",
            ],
          },
        },
      });
    } catch {
    }
    await app.close();
  });

  describe("Customer-Merchant Chat (US-C01)", () => {
    it("should return chat available when order is PREPARING", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/chat/order/${testOrder.id}/status`)
        .expect(200);

      expect(response.body.canChatWithMerchant).toBe(true);
      expect(response.body.orderStatus).toBe("PREPARING");
    });

    it("should create customer-merchant chat room", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/rooms")
        .send({
          orderId: testOrder.id,
          type: "CUSTOMER_MERCHANT",
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.type).toBe("CUSTOMER_MERCHANT");
      expect(response.body.status).toBe("ACTIVE");
      merchantChatRoom = response.body;
    });

    it("should send message to merchant", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: merchantChatRoom.id,
          content: "Mohon tambah sambal ya",
        })
        .expect(201);

      expect(response.body.content).toBe("Mohon tambah sambal ya");
      expect(response.body.status).toBe("SENT");
      expect(response.body.type).toBe("TEXT");
    });

    it("should get messages with pagination info", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/chat/rooms/${merchantChatRoom.id}/messages`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.hasMore).toBeDefined();
    });

    it("should mark messages as read", async () => {
      const msgResponse = await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: merchantChatRoom.id,
          content: "Another message",
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`/api/chat/rooms/${merchantChatRoom.id}/read`)
        .send({
          lastReadMessageId: msgResponse.body.id,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should return correct unread count", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/chat/unread-count")
        .expect(200);

      expect(response.body.count).toBeDefined();
      expect(typeof response.body.count).toBe("number");
    });
  });

  describe("Customer-Driver Chat (US-C02)", () => {
    beforeAll(async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "ON_DELIVERY" },
      });
    });

    it("should allow driver chat when order is ON_DELIVERY", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/chat/order/${testOrder.id}/status`)
        .expect(200);

      expect(response.body.canChatWithDriver).toBe(true);
      expect(response.body.canChatWithMerchant).toBe(false);
    });

    it("should create customer-driver chat room", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/rooms")
        .send({
          orderId: testOrder.id,
          type: "CUSTOMER_DRIVER",
        })
        .expect(201);

      expect(response.body.type).toBe("CUSTOMER_DRIVER");
      expect(response.body.status).toBe("ACTIVE");
      driverChatRoom = response.body;
    });

    it("should send location message to driver", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: driverChatRoom.id,
          content: "My location",
          type: "LOCATION",
          metadata: {
            latitude: -6.2088,
            longitude: 106.8456,
          },
        })
        .expect(201);

      expect(response.body.type).toBe("LOCATION");
      expect(response.body.metadata).toBeDefined();
    });
  });

  describe("Customer Support Chat (US-C03)", () => {
    it("should create support ticket with chat room", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/support/tickets")
        .send({
          subject: "Order tidak sampai",
          category: "ORDER_ISSUE",
          initialMessage: "Pesanan saya sudah 2 jam tidak sampai",
        })
        .expect(201);

      expect(response.body.ticket).toBeDefined();
      expect(response.body.ticket.subject).toBe("Order tidak sampai");
      expect(response.body.ticket.category).toBe("ORDER_ISSUE");
      expect(response.body.ticket.status).toBe("OPEN");
      expect(response.body.chatRoom).toBeDefined();
      expect(response.body.chatRoom.type).toBe("CUSTOMER_SUPPORT");

      supportTicket = response.body.ticket;
      supportChatRoom = response.body.chatRoom;
    });

    it("should send message to support chat", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: supportChatRoom.id,
          content: "Tolong bantu saya",
        })
        .expect(201);

      expect(response.body.content).toBe("Tolong bantu saya");
    });

    it("should get user's support tickets", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/chat/support/my-tickets")
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("Admin Support Management (US-A01)", () => {
    it("should list all support tickets (admin)", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/admin/support/tickets")
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.meta).toBeDefined();
    });

    it("should assign ticket to admin", async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/admin/support/tickets/${supportTicket.id}/assign-self`)
        .expect(200);

      expect(response.body.assignedAdminId).toBe(testAdmin.id);
      expect(response.body.status).toBe("IN_PROGRESS");
    });

    it("should update ticket priority", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/admin/support/tickets/${supportTicket.id}`)
        .send({
          priority: "HIGH",
        })
        .expect(200);

      expect(response.body.priority).toBe("HIGH");
    });

    it("should resolve support ticket", async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/admin/support/tickets/${supportTicket.id}/resolve`)
        .send({
          resolution: "Refund processed",
        })
        .expect(200);

      expect(response.body.status).toBe("RESOLVED");
      expect(response.body.resolution).toBe("Refund processed");
    });

    it("should get support ticket statistics", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/admin/support/stats")
        .expect(200);

      expect(response.body.total).toBeDefined();
      expect(response.body.resolved).toBeDefined();
    });
  });

  describe("Chat Room Management", () => {
    it("should get all chat rooms for user", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/chat/rooms")
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.meta).toBeDefined();
    });

    it("should filter chat rooms by status", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/chat/rooms?status=ACTIVE")
        .expect(200);

      expect(response.body.data).toBeDefined();
    });

    it("should filter chat rooms by type", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/chat/rooms?type=CUSTOMER_MERCHANT")
        .expect(200);

      expect(response.body.data).toBeDefined();
    });

    it("should close a chat room", async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/chat/rooms/${merchantChatRoom.id}/close`)
        .send({
          reason: "Order completed",
        })
        .expect(200);

      expect(response.body.status).toBe("CLOSED");
      expect(response.body.closedReason).toBe("Order completed");
    });

    it("should reject message to closed chat room", async () => {
      await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: merchantChatRoom.id,
          content: "This should fail",
        })
        .expect(403);
    });
  });

  describe("Message Validation", () => {
    it("should reject empty message content", async () => {
      await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: driverChatRoom.id,
          content: "",
        })
        .expect(400);
    });

    it("should reject whitespace-only message", async () => {
      await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: driverChatRoom.id,
          content: "   ",
        })
        .expect(400);
    });

    it("should reject message exceeding max length", async () => {
      const longContent = "a".repeat(2001);
      await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: driverChatRoom.id,
          content: longContent,
        })
        .expect(400);
    });
  });

  describe("Message Deduplication", () => {
    it("should handle duplicate clientMessageId", async () => {
      const clientMessageId = `client-${Date.now()}`;

      const response1 = await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: driverChatRoom.id,
          content: "Test deduplication",
          clientMessageId,
        })
        .expect(201);

      const response2 = await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: driverChatRoom.id,
          content: "Test deduplication",
          clientMessageId,
        })
        .expect(201);

      expect(response1.body.id).toBe(response2.body.id);
    });
  });
});
