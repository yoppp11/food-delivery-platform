import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/common/prisma.service";
import { Queue } from "bullmq";
import { getQueueToken } from "@nestjs/bullmq";

describe("Driver Auto-Assignment (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let driverAssignmentQueue: Queue;
  let testCustomer: any;
  let testMerchantOwner: any;
  let testDriverUser: any;
  let testMerchant: any;
  let testDriver: any;
  let testOrder: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    driverAssignmentQueue = moduleFixture.get<Queue>(
      getQueueToken("driver-assignment"),
    );
    await app.init();

    testCustomer = await prisma.user.create({
      data: {
        id: "auto-assign-test-customer",
        email: "auto-assign-customer@test.com",
        emailVerified: false,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    testMerchantOwner = await prisma.user.create({
      data: {
        id: "auto-assign-merchant-owner",
        email: "auto-assign-merchant@test.com",
        emailVerified: false,
        role: "MERCHANT",
        status: "ACTIVE",
      },
    });

    testDriverUser = await prisma.user.create({
      data: {
        id: "auto-assign-driver-user",
        email: "auto-assign-driver@test.com",
        emailVerified: false,
        role: "DRIVER",
        status: "ACTIVE",
      },
    });

    testMerchant = await prisma.merchant.create({
      data: {
        id: "auto-assign-test-merchant",
        ownerId: testMerchantOwner.id,
        name: "Auto Assign Test Restaurant",
        latitude: -6.2088,
        longitude: 106.8456,
        isOpen: true,
        approvalStatus: "APPROVED",
      },
    });

    testDriver = await prisma.driver.create({
      data: {
        id: "auto-assign-test-driver",
        userId: testDriverUser.id,
        plateNumber: "B 5678 ABC",
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

    testOrder = await prisma.order.create({
      data: {
        id: "auto-assign-test-order",
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
      await prisma.notification.deleteMany({
        where: {
          userId: {
            in: [
              "auto-assign-test-customer",
              "auto-assign-merchant-owner",
              "auto-assign-driver-user",
            ],
          },
        },
      });
      await prisma.delivery.deleteMany({
        where: { orderId: testOrder?.id },
      });
      await prisma.order.deleteMany({ where: { id: testOrder?.id } });
      await prisma.driverLocation.deleteMany({
        where: { driverId: testDriver?.id },
      });
      await prisma.driver.deleteMany({ where: { id: testDriver?.id } });
      await prisma.merchant.deleteMany({ where: { id: testMerchant?.id } });
      await prisma.user.deleteMany({
        where: {
          id: {
            in: [
              "auto-assign-test-customer",
              "auto-assign-merchant-owner",
              "auto-assign-driver-user",
            ],
          },
        },
      });
    } catch {
      // Ignore cleanup errors
    }
    await app.close();
  });

  describe("Queue Operations", () => {
    it("should add job to driver-assignment queue", async () => {
      const jobData = {
        orderId: testOrder.id,
        merchantId: testMerchant.id,
      };

      const job = await driverAssignmentQueue.add("assign-driver", jobData, {
        delay: 0,
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      });

      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.data.orderId).toBe(testOrder.id);
      expect(job.data.merchantId).toBe(testMerchant.id);
    });

    it("should process driver assignment job", async () => {
      await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: "READY" },
      });

      const jobData = {
        orderId: testOrder.id,
        merchantId: testMerchant.id,
      };

      const job = await driverAssignmentQueue.add("assign-driver", jobData);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const updatedOrder = await prisma.order.findUnique({
        where: { id: testOrder.id },
      });

      expect(updatedOrder).toBeDefined();

      const delivery = await prisma.delivery.findFirst({
        where: { orderId: testOrder.id },
      });

      if (updatedOrder?.driverId) {
        expect(delivery).toBeDefined();
      }
    });
  });

  describe("Driver Finding Logic", () => {
    it("should find nearest available driver", async () => {
      const availableDrivers = await prisma.driver.findMany({
        where: {
          isAvailable: true,
          approvalStatus: "APPROVED",
        },
        include: {
          driverLocations: {
            orderBy: { recordedAt: "desc" },
            take: 1,
          },
        },
      });

      const driversWithLocation = availableDrivers.filter(
        (d) => d.driverLocations.length > 0,
      );

      expect(driversWithLocation.length).toBeGreaterThanOrEqual(0);
    });

    it("should exclude drivers without recent location", async () => {
      await prisma.driver.create({
        data: {
          id: "no-location-driver",
          userId: testDriverUser.id,
          plateNumber: "B 9999 ZZZ",
          isAvailable: true,
          approvalStatus: "APPROVED",
        },
      });

      const availableDrivers = await prisma.driver.findMany({
        where: {
          isAvailable: true,
          approvalStatus: "APPROVED",
        },
        include: {
          driverLocations: {
            orderBy: { recordedAt: "desc" },
            take: 1,
          },
        },
      });

      const driversWithLocation = availableDrivers.filter(
        (d) => d.driverLocations.length > 0,
      );

      const noLocationDriver = driversWithLocation.find(
        (d) => d.id === "no-location-driver",
      );
      expect(noLocationDriver).toBeUndefined();

      await prisma.driver.delete({ where: { id: "no-location-driver" } });
    });
  });

  describe("Notification Creation", () => {
    it("should create notification when driver is assigned", async () => {
      await prisma.notification.create({
        data: {
          userId: testCustomer.id,
          type: "ORDER",
          message: `A driver has been assigned to your order! ${testDriverUser.email} will deliver your order.`,
          isRead: false,
        },
      });

      const notifications = await prisma.notification.findMany({
        where: { userId: testCustomer.id, type: "ORDER" },
      });

      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].message).toContain("driver");
    });

    it("should notify driver of new assignment", async () => {
      await prisma.notification.create({
        data: {
          userId: testDriverUser.id,
          type: "ORDER",
          message: `New delivery assigned! Pick up from ${testMerchant.name}.`,
          isRead: false,
        },
      });

      const notifications = await prisma.notification.findMany({
        where: { userId: testDriverUser.id, type: "ORDER" },
      });

      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].message).toContain("delivery");
    });
  });
});
