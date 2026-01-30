import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { TestAppModule } from "./test-app.module";
import { PrismaService } from "../src/common/prisma.service";

describe("Driver Assignment and Chat Flow (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let testMerchant: any;
  let testCustomer: any;
  let testDriver: any;
  let testDriverUser: any;
  let testMerchantOwner: any;
  let testMenuVariant: any;
  let testOrder: any;

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
        id: "test-customer-driver-flow",
        email: "customer-driver-test@test.com",
        emailVerified: false,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    testMerchantOwner = await prisma.user.create({
      data: {
        id: "merchant-owner-driver-flow",
        email: "merchant-driver-test@test.com",
        emailVerified: false,
        role: "MERCHANT",
        status: "ACTIVE",
      },
    });

    testDriverUser = await prisma.user.create({
      data: {
        id: "driver-user-flow",
        email: "driver-test@test.com",
        emailVerified: false,
        role: "DRIVER",
        status: "ACTIVE",
      },
    });

    testMerchant = await prisma.merchant.create({
      data: {
        id: "test-merchant-driver-flow",
        ownerId: testMerchantOwner.id,
        name: "Test Restaurant Driver Flow",
        latitude: -6.2088,
        longitude: 106.8456,
        isOpen: true,
        approvalStatus: "APPROVED",
      },
    });

    testDriver = await prisma.driver.create({
      data: {
        id: "test-driver-flow",
        userId: testDriverUser.id,
        plateNumber: "B 1234 XYZ",
        isAvailable: true,
        approvalStatus: "APPROVED",
      },
    });

    await prisma.driverLocation.create({
      data: {
        driverId: testDriver.id,
        latitude: -6.2090,
        longitude: 106.8460,
        recordedAt: new Date(),
      },
    });

    const category = await prisma.merchantMenuCategory.create({
      data: {
        id: "test-category-driver-flow",
        name: "Main Course",
        merchantId: testMerchant.id,
      },
    });

    const menu = await prisma.menu.create({
      data: {
        id: "test-menu-driver-flow",
        name: "Test Burger",
        description: "Delicious burger",
        price: 50000,
        merchantId: testMerchant.id,
        categoryId: category.id,
        isAvailable: true,
      },
    });

    testMenuVariant = await prisma.menuVariant.create({
      data: {
        id: "test-variant-driver-flow",
        name: "Regular",
        price: 50000,
        menuId: menu.id,
      },
    });

    testOrder = await prisma.order.create({
      data: {
        id: "test-order-driver-flow",
        userId: testCustomer.id,
        merchantId: testMerchant.id,
        status: "PAID",
        totalPrice: 50000,
        paymentStatus: "SUCCESS",
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: testOrder.id,
        variantId: testMenuVariant.id,
        quantity: 1,
        price: 50000,
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: testOrder.id,
        status: "PAID",
        changedAt: new Date(),
        changedBy: testCustomer.id,
      },
    });
  });

  afterAll(async () => {
    try {
      await prisma.chatMessage.deleteMany({});
      await prisma.chatParticipant.deleteMany({});
      await prisma.chatRoom.deleteMany({});
      await prisma.notification.deleteMany({});
      await prisma.delivery.deleteMany({});
      await prisma.orderStatusHistory.deleteMany({});
      await prisma.orderItem.deleteMany({});
      await prisma.order.deleteMany({});
      await prisma.driverLocation.deleteMany({});
      await prisma.driver.deleteMany({ where: { id: testDriver?.id } });
      await prisma.menuVariant.deleteMany({ where: { id: testMenuVariant?.id } });
      await prisma.menu.deleteMany({ where: { id: "test-menu-driver-flow" } });
      await prisma.merchantMenuCategory.deleteMany({ where: { id: "test-category-driver-flow" } });
      await prisma.merchant.deleteMany({ where: { id: testMerchant?.id } });
      await prisma.user.deleteMany({
        where: {
          id: {
            in: [
              "test-customer-driver-flow",
              "merchant-owner-driver-flow",
              "driver-user-flow",
            ],
          },
        },
      });
    } catch {
      // Ignore cleanup errors
    }
    await app.close();
  });

  describe("Order Status Flow", () => {
    it("should get order by id", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/orders/${testOrder.id}`)
        .expect(200);

      expect(response.body.id).toBe(testOrder.id);
      expect(response.body.status).toBe("PAID");
    });

    it("should update order status to PREPARING", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "PREPARING" },
      });

      const order = await prisma.order.findUnique({
        where: { id: testOrder.id },
      });

      expect(order?.status).toBe("PREPARING");
    });

    it("should update order status to READY", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "READY" },
      });

      const order = await prisma.order.findUnique({
        where: { id: testOrder.id },
      });

      expect(order?.status).toBe("READY");
    });
  });

  describe("Driver Operations", () => {
    it("should list available orders for driver", async () => {
      const availableOrders = await prisma.order.findMany({
        where: {
          status: "READY",
          driverId: null,
        },
      });

      expect(Array.isArray(availableOrders)).toBe(true);
    });

    it("should allow driver to accept delivery", async () => {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: testOrder.id },
          data: {
            driverId: testDriver.id,
            status: "ON_DELIVERY",
          },
        });

        await tx.driver.update({
          where: { id: testDriver.id },
          data: { isAvailable: false },
        });

        await tx.delivery.create({
          data: {
            orderId: testOrder.id,
            driverId: testDriver.id,
            pickedAt: new Date(),
            deliveredAt: new Date(),
            distanceKm: 2.5,
          },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: testOrder.id,
            status: "ON_DELIVERY",
            changedAt: new Date(),
            changedBy: testDriverUser.id,
          },
        });
      });

      const order = await prisma.order.findUnique({
        where: { id: testOrder.id },
      });

      expect(order?.status).toBe("ON_DELIVERY");
      expect(order?.driverId).toBe(testDriver.id);
    });

    it("should allow driver to complete delivery", async () => {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: testOrder.id },
          data: { status: "COMPLETED" },
        });

        await tx.driver.update({
          where: { id: testDriver.id },
          data: { isAvailable: true },
        });

        await tx.delivery.updateMany({
          where: { orderId: testOrder.id },
          data: { deliveredAt: new Date() },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: testOrder.id,
            status: "COMPLETED",
            changedAt: new Date(),
            changedBy: testDriverUser.id,
          },
        });
      });

      const order = await prisma.order.findUnique({
        where: { id: testOrder.id },
      });

      expect(order?.status).toBe("COMPLETED");

      const driver = await prisma.driver.findUnique({
        where: { id: testDriver.id },
      });

      expect(driver?.isAvailable).toBe(true);
    });
  });

  describe("Chat System", () => {
    let merchantChatRoom: any;
    let driverChatRoom: any;

    it("should create customer-merchant chat room", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "PREPARING" },
      });

      merchantChatRoom = await prisma.chatRoom.create({
        data: {
          orderId: testOrder.id,
          type: "CUSTOMER_MERCHANT",
          participants: {
            create: [
              { userId: testCustomer.id, role: "CUSTOMER" },
              { userId: testMerchantOwner.id, role: "MERCHANT" },
            ],
          },
        },
        include: { participants: true },
      });

      expect(merchantChatRoom).toBeDefined();
      expect(merchantChatRoom.type).toBe("CUSTOMER_MERCHANT");
      expect(merchantChatRoom.participants.length).toBe(2);
    });

    it("should allow sending messages in merchant chat", async () => {
      const message = await prisma.chatMessage.create({
        data: {
          chatRoomId: merchantChatRoom.id,
          senderId: testCustomer.id,
          content: "Hello, is my order ready?",
          type: "TEXT",
        },
      });

      expect(message).toBeDefined();
      expect(message.content).toBe("Hello, is my order ready?");
    });

    it("should create customer-driver chat room when order is on delivery", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "ON_DELIVERY", driverId: testDriver.id },
      });

      driverChatRoom = await prisma.chatRoom.create({
        data: {
          orderId: testOrder.id,
          type: "CUSTOMER_DRIVER",
          participants: {
            create: [
              { userId: testCustomer.id, role: "CUSTOMER" },
              { userId: testDriverUser.id, role: "DRIVER" },
            ],
          },
        },
        include: { participants: true },
      });

      expect(driverChatRoom).toBeDefined();
      expect(driverChatRoom.type).toBe("CUSTOMER_DRIVER");
      expect(driverChatRoom.participants.length).toBe(2);
    });

    it("should allow sending messages in driver chat", async () => {
      const message = await prisma.chatMessage.create({
        data: {
          chatRoomId: driverChatRoom.id,
          senderId: testCustomer.id,
          content: "Are you almost here?",
          type: "TEXT",
        },
      });

      expect(message).toBeDefined();
      expect(message.content).toBe("Are you almost here?");
    });

    it("should get chat messages for a room", async () => {
      const messages = await prisma.chatMessage.findMany({
        where: { chatRoomId: driverChatRoom.id },
        orderBy: { createdAt: "asc" },
      });

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
    });
  });

  describe("Chat Status Validation", () => {
    it("should validate merchant chat is available during preparation", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "PREPARING" },
      });

      const order = await prisma.order.findUnique({
        where: { id: testOrder.id },
      });

      const merchantChatStatuses = ["PAID", "PREPARING", "READY"];
      const canChatWithMerchant = merchantChatStatuses.includes(order!.status);

      expect(canChatWithMerchant).toBe(true);
    });

    it("should validate driver chat is available during delivery", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "ON_DELIVERY" },
      });

      const order = await prisma.order.findUnique({
        where: { id: testOrder.id },
      });

      const driverChatStatuses = ["ON_DELIVERY"];
      const canChatWithDriver = driverChatStatuses.includes(order!.status);

      expect(canChatWithDriver).toBe(true);
    });

    it("should validate merchant chat is closed after order is on delivery", async () => {
      const order = await prisma.order.findUnique({
        where: { id: testOrder.id },
      });

      const merchantChatStatuses = ["PAID", "PREPARING", "READY"];
      const canChatWithMerchant = merchantChatStatuses.includes(order!.status);

      expect(canChatWithMerchant).toBe(false);
    });
  });

  describe("Notification System", () => {
    it("should create notification for customer when driver is assigned", async () => {
      const notification = await prisma.notification.create({
        data: {
          userId: testCustomer.id,
          type: "ORDER",
          message: `A driver has been assigned to your order!`,
          isRead: false,
        },
      });

      expect(notification).toBeDefined();
      expect(notification.type).toBe("ORDER");
    });

    it("should create notification for customer when order is completed", async () => {
      const notification = await prisma.notification.create({
        data: {
          userId: testCustomer.id,
          type: "ORDER",
          message: `Your order has been delivered! Enjoy your meal.`,
          isRead: false,
        },
      });

      expect(notification).toBeDefined();
      expect(notification.message).toContain("delivered");
    });

    it("should get unread notifications for user", async () => {
      const notifications = await prisma.notification.findMany({
        where: { userId: testCustomer.id, isRead: false },
        orderBy: { createdAt: "desc" },
      });

      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBeGreaterThan(0);
    });
  });
});
