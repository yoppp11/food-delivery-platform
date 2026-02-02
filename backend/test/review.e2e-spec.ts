import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/common/prisma.service";

describe("Order Review (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let customerToken: string;
  let testUser: any;
  let testMerchant: any;
  let testDriver: any;
  let testOrder: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    testUser = await prisma.user.create({
      data: {
        id: "test-user-review-e2e",
        email: "review-test@test.com",
        emailVerified: false,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    const session = await prisma.session.create({
      data: {
        userId: testUser.id,
        token: `test-customer-token-review-${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    customerToken = session.token;

    const merchantOwner = await prisma.user.create({
      data: {
        id: "merchant-owner-review-e2e",
        email: "merchant-review@test.com",
        emailVerified: false,
        role: "MERCHANT",
        status: "ACTIVE",
      },
    });

    testMerchant = await prisma.merchant.create({
      data: {
        id: "test-merchant-review-e2e",
        ownerId: merchantOwner.id,
        name: "Test Restaurant Review",
        latitude: -6.2088,
        longitude: 106.8456,
        isOpen: true,
        approvalStatus: "APPROVED",
      },
    });

    const driverUser = await prisma.user.create({
      data: {
        id: "driver-user-review-e2e",
        email: "driver-review@test.com",
        emailVerified: false,
        role: "DRIVER",
        status: "ACTIVE",
        userProfiles: {
          create: {
            id: "driver-profile-review-e2e",
            fullName: "John Driver",
          },
        },
      },
    });

    testDriver = await prisma.driver.create({
      data: {
        id: "test-driver-review-e2e",
        userId: driverUser.id,
        plateNumber: "B 1234 XYZ",
        isAvailable: true,
        approvalStatus: "APPROVED",
      },
    });

    testOrder = await prisma.order.create({
      data: {
        id: "test-order-review-e2e",
        userId: testUser.id,
        merchantId: testMerchant.id,
        driverId: testDriver.id,
        status: "COMPLETED",
        totalPrice: 50000,
        deliveryFee: 10000,
        paymentStatus: "SUCCESS",
        deliveryLatitude: -6.2088,
        deliveryLongitude: 106.8456,
      },
    });
  });

  afterAll(async () => {
    try {
      await prisma.session.deleteMany({
        where: { userId: testUser?.id },
      });
      await prisma.driverReview.deleteMany({
        where: { userId: testUser?.id },
      });
      await prisma.merchantReview.deleteMany({
        where: { userId: testUser?.id },
      });
      await prisma.order.deleteMany({
        where: { id: testOrder?.id },
      });
      await prisma.driver.deleteMany({
        where: { id: testDriver?.id },
      });
      await prisma.userProfile.deleteMany({
        where: { id: "driver-profile-review-e2e" },
      });
      await prisma.merchant.deleteMany({
        where: { id: testMerchant?.id },
      });
      await prisma.user.deleteMany({
        where: {
          id: {
            in: [
              "test-user-review-e2e",
              "merchant-owner-review-e2e",
              "driver-user-review-e2e",
            ],
          },
        },
      });
    } catch {
      // Ignore cleanup errors
    }
    await app.close();
  });

  describe("GET /api/reviews/orders/:orderId/status", () => {
    it("should return review status for completed order", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/reviews/orders/${testOrder.id}/status`)
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        orderId: testOrder.id,
        merchantId: testMerchant.id,
        merchantName: "Test Restaurant Review",
        driverId: testDriver.id,
        driverName: "John Driver",
        driverPlateNumber: "B 1234 XYZ",
        canReviewMerchant: true,
        canReviewDriver: true,
        merchantReview: null,
        driverReview: null,
      });
    });

    it("should return 404 for non-existent order", async () => {
      await request(app.getHttpServer())
        .get("/api/reviews/orders/00000000-0000-0000-0000-000000000000/status")
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(404);
    });
  });

  describe("POST /api/reviews/merchants/:merchantId", () => {
    it("should create merchant review", async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/reviews/merchants/${testMerchant.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          rating: 5,
          comment: "Great food!",
        })
        .expect(201);

      expect(response.body).toMatchObject({
        rating: 5,
        comment: "Great food!",
        merchantId: testMerchant.id,
        userId: testUser.id,
      });
    });

    it("should not allow duplicate merchant review", async () => {
      await request(app.getHttpServer())
        .post(`/api/reviews/merchants/${testMerchant.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          rating: 4,
          comment: "Another review",
        })
        .expect(400);
    });
  });

  describe("POST /api/reviews/drivers/:driverId", () => {
    it("should create driver review", async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/reviews/drivers/${testDriver.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          rating: 5,
          comment: "Fast delivery!",
        })
        .expect(201);

      expect(response.body).toMatchObject({
        rating: 5,
        comment: "Fast delivery!",
        driverId: testDriver.id,
        userId: testUser.id,
      });
    });

    it("should not allow duplicate driver review", async () => {
      await request(app.getHttpServer())
        .post(`/api/reviews/drivers/${testDriver.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          rating: 4,
          comment: "Another review",
        })
        .expect(400);
    });
  });

  describe("GET /api/reviews/orders/:orderId/status after review", () => {
    it("should show existing reviews", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/reviews/orders/${testOrder.id}/status`)
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.canReviewMerchant).toBe(false);
      expect(response.body.canReviewDriver).toBe(false);
      expect(response.body.merchantReview).not.toBeNull();
      expect(response.body.merchantReview.rating).toBe(5);
      expect(response.body.driverReview).not.toBeNull();
      expect(response.body.driverReview.rating).toBe(5);
    });
  });
});
