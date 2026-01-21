import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/common/prisma.service";

describe("AdminController (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let adminToken: string;
  let testUserId: string;
  let testMerchantId: string;
  let testPromotionId: string;
  let testCategoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prisma = app.get<PrismaService>(PrismaService);
    await app.init();

    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      throw new Error("No admin user found in database. Please seed the database first.");
    }

    const session = await prisma.session.create({
      data: {
        userId: adminUser.id,
        token: `test-admin-token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    adminToken = session.token;
  });

  afterAll(async () => {
    if (testPromotionId) {
      await prisma.promotion.delete({ where: { id: testPromotionId } }).catch(() => {});
    }
    if (testCategoryId) {
      await prisma.category.delete({ where: { id: testCategoryId } }).catch(() => {});
    }
    await prisma.session.deleteMany({
      where: { token: { startsWith: "test-admin-token-" } },
    });
    await app.close();
  });

  describe("Dashboard", () => {
    it("GET /admin/dashboard - should return dashboard stats", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("totalUsers");
      expect(response.body).toHaveProperty("totalMerchants");
      expect(response.body).toHaveProperty("totalDrivers");
      expect(response.body).toHaveProperty("totalOrders");
      expect(response.body).toHaveProperty("totalRevenue");
      expect(typeof response.body.totalUsers).toBe("number");
      expect(typeof response.body.totalMerchants).toBe("number");
    });

    it("GET /admin/dashboard - should reject unauthorized requests", async () => {
      await request(app.getHttpServer())
        .get("/admin/dashboard")
        .expect(401);
    });
  });

  describe("User Management", () => {
    it("GET /admin/users - should return paginated users list", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("limit");
      expect(response.body).toHaveProperty("totalPages");
      expect(Array.isArray(response.body.data)).toBe(true);

      if (response.body.data.length > 0) {
        testUserId = response.body.data[0].id;
        expect(response.body.data[0]).toHaveProperty("email");
        expect(response.body.data[0]).toHaveProperty("role");
        expect(response.body.data[0]).toHaveProperty("status");
      }
    });

    it("GET /admin/users - should filter by role", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/users?role=CUSTOMER")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      response.body.data.forEach((user: { role: string }) => {
        expect(user.role).toBe("CUSTOMER");
      });
    });

    it("GET /admin/users/:id - should return user details", async () => {
      if (!testUserId) return;

      const response = await request(app.getHttpServer())
        .get(`/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", testUserId);
      expect(response.body).toHaveProperty("email");
    });

    it("PATCH /admin/users/:id/status - should update user status", async () => {
      const user = await prisma.user.findFirst({
        where: { role: "CUSTOMER", status: "ACTIVE" },
      });

      if (!user) return;

      await request(app.getHttpServer())
        .patch(`/admin/users/${user.id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "SUSPENDED" })
        .expect(200);

      await prisma.user.update({
        where: { id: user.id },
        data: { status: "ACTIVE" },
      });
    });
  });

  describe("Merchant Management", () => {
    it("GET /admin/merchants - should return paginated merchants list", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/merchants")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.data)).toBe(true);

      if (response.body.data.length > 0) {
        testMerchantId = response.body.data[0].id;
        expect(response.body.data[0]).toHaveProperty("name");
        expect(response.body.data[0]).toHaveProperty("isOpen");
      }
    });

    it("GET /admin/merchants/:id - should return merchant details", async () => {
      if (!testMerchantId) return;

      const response = await request(app.getHttpServer())
        .get(`/admin/merchants/${testMerchantId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", testMerchantId);
      expect(response.body).toHaveProperty("name");
    });
  });

  describe("Driver Management", () => {
    it("GET /admin/drivers - should return paginated drivers list", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/drivers")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.data)).toBe(true);

      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty("plateNumber");
        expect(response.body.data[0]).toHaveProperty("isAvailable");
      }
    });

    it("GET /admin/drivers - should filter by availability", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/drivers?isAvailable=true")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      response.body.data.forEach((driver: { isAvailable: boolean }) => {
        expect(driver.isAvailable).toBe(true);
      });
    });
  });

  describe("Order Management", () => {
    it("GET /admin/orders - should return paginated orders list", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("GET /admin/orders - should filter by status", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/orders?status=COMPLETED")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      response.body.data.forEach((order: { status: string }) => {
        expect(order.status).toBe("COMPLETED");
      });
    });
  });

  describe("Promotion Management", () => {
    it("POST /admin/promotions - should create a new promotion", async () => {
      const response = await request(app.getHttpServer())
        .post("/admin/promotions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          code: "TEST2024",
          discountType: "PERCENT",
          discountValue: 10,
          maxDiscount: 50000,
          expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.code).toBe("TEST2024");
      testPromotionId = response.body.id;
    });

    it("GET /admin/promotions - should return paginated promotions list", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/promotions")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("PATCH /admin/promotions/:id - should update a promotion", async () => {
      if (!testPromotionId) return;

      const response = await request(app.getHttpServer())
        .patch(`/admin/promotions/${testPromotionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ discountValue: 15 })
        .expect(200);

      expect(response.body.discountValue).toBe(15);
    });

    it("DELETE /admin/promotions/:id - should delete a promotion", async () => {
      if (!testPromotionId) return;

      await request(app.getHttpServer())
        .delete(`/admin/promotions/${testPromotionId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      testPromotionId = "";
    });
  });

  describe("Category Management", () => {
    it("POST /admin/categories - should create a new category", async () => {
      const response = await request(app.getHttpServer())
        .post("/admin/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Category",
          description: "A test category for e2e testing",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Test Category");
      testCategoryId = response.body.id;
    });

    it("GET /admin/categories - should return paginated categories list", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("PATCH /admin/categories/:id - should update a category", async () => {
      if (!testCategoryId) return;

      const response = await request(app.getHttpServer())
        .patch(`/admin/categories/${testCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Test Category" })
        .expect(200);

      expect(response.body.name).toBe("Updated Test Category");
    });

    it("DELETE /admin/categories/:id - should delete a category", async () => {
      if (!testCategoryId) return;

      await request(app.getHttpServer())
        .delete(`/admin/categories/${testCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      testCategoryId = "";
    });
  });

  describe("Reports", () => {
    it("GET /admin/reports - should return reports data", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/reports")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("totalRevenue");
      expect(response.body).toHaveProperty("totalOrders");
      expect(response.body).toHaveProperty("averageOrderValue");
      expect(response.body).toHaveProperty("topMerchants");
      expect(Array.isArray(response.body.topMerchants)).toBe(true);
    });

    it("GET /admin/reports - should filter by date range", async () => {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const response = await request(app.getHttpServer())
        .get(`/admin/reports?startDate=${startDate}&endDate=${endDate}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("totalRevenue");
      expect(response.body).toHaveProperty("totalOrders");
    });
  });
});
