import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { TestAppModule } from "./test-app.module";
import { PrismaService } from "../src/common/prisma.service";

describe("Chat API (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let testCustomer: any;
  let testMerchantOwner: any;
  let testMerchant: any;
  let testOrder: any;
  let testChatRoom: any;

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
        id: "chat-test-customer",
        email: "chat-customer@test.com",
        emailVerified: false,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    testMerchantOwner = await prisma.user.create({
      data: {
        id: "chat-test-merchant-owner",
        email: "chat-merchant@test.com",
        emailVerified: false,
        role: "MERCHANT",
        status: "ACTIVE",
      },
    });

    testMerchant = await prisma.merchant.create({
      data: {
        id: "chat-test-merchant",
        ownerId: testMerchantOwner.id,
        name: "Chat Test Restaurant",
        latitude: -6.2088,
        longitude: 106.8456,
        isOpen: true,
        approvalStatus: "APPROVED",
      },
    });

    testOrder = await prisma.order.create({
      data: {
        id: "chat-test-order",
        userId: testCustomer.id,
        merchantId: testMerchant.id,
        status: "PREPARING",
        totalPrice: 50000,
        paymentStatus: "SUCCESS",
      },
    });
  });

  afterAll(async () => {
    try {
      await prisma.chatMessage.deleteMany({
        where: { chatRoom: { orderId: testOrder?.id } },
      });
      await prisma.chatParticipant.deleteMany({
        where: { chatRoom: { orderId: testOrder?.id } },
      });
      await prisma.chatRoom.deleteMany({
        where: { orderId: testOrder?.id },
      });
      await prisma.order.deleteMany({ where: { id: testOrder?.id } });
      await prisma.merchant.deleteMany({ where: { id: testMerchant?.id } });
      await prisma.user.deleteMany({
        where: {
          id: { in: ["chat-test-customer", "chat-test-merchant-owner"] },
        },
      });
    } catch {
      // Ignore cleanup errors
    }
    await app.close();
  });

  describe("GET /api/chat/order/:orderId/status", () => {
    it("should return chat status for order in PREPARING status", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/chat/order/${testOrder.id}/status`)
        .expect(200);

      expect(response.body.canChatWithMerchant).toBe(true);
      expect(response.body.canChatWithDriver).toBe(false);
      expect(response.body.orderStatus).toBe("PREPARING");
    });

    it("should return correct status when order is READY", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "READY" },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/chat/order/${testOrder.id}/status`)
        .expect(200);

      expect(response.body.canChatWithMerchant).toBe(true);
      expect(response.body.canChatWithDriver).toBe(false);
    });
  });

  describe("POST /api/chat/rooms", () => {
    it("should create a customer-merchant chat room", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/rooms")
        .send({
          orderId: testOrder.id,
          type: "CUSTOMER_MERCHANT",
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.type).toBe("CUSTOMER_MERCHANT");
      expect(response.body.orderId).toBe(testOrder.id);

      testChatRoom = response.body;
    });

    it("should return existing room instead of creating duplicate", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/rooms")
        .send({
          orderId: testOrder.id,
          type: "CUSTOMER_MERCHANT",
        })
        .expect(201);

      expect(response.body.id).toBe(testChatRoom.id);
    });
  });

  describe("POST /api/chat/messages", () => {
    it("should send a message successfully", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: testChatRoom.id,
          content: "Hello, when will my order be ready?",
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.content).toBe("Hello, when will my order be ready?");
      expect(response.body.chatRoomId).toBe(testChatRoom.id);
    });

    it("should reject empty messages", async () => {
      await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: testChatRoom.id,
          content: "",
        })
        .expect(400);
    });
  });

  describe("GET /api/chat/rooms/:id/messages", () => {
    it("should get messages for chat room", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/chat/rooms/${testChatRoom.id}/messages`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("Chat closed on order status change", () => {
    it("should close merchant chat when order is ON_DELIVERY", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "ON_DELIVERY" },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/chat/order/${testOrder.id}/status`)
        .expect(200);

      expect(response.body.canChatWithMerchant).toBe(false);
    });

    it("should return 403 when trying to send message to closed chat", async () => {
      await request(app.getHttpServer())
        .post("/api/chat/messages")
        .send({
          chatRoomId: testChatRoom.id,
          content: "This should fail",
        })
        .expect(403);
    });
  });
});
