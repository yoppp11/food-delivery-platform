import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/common/prisma.service";

describe("Order Flow (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let testMerchant: any;
  let testUser: any;
  let testMenuVariant: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    testUser = await prisma.user.create({
      data: {
        id: "test-user-order",
        email: "order-test@test.com",
        emailVerified: false,
        role: "CUSTOMER",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const merchantOwner = await prisma.user.create({
      data: {
        id: "merchant-owner-order",
        email: "merchant-order@test.com",
        emailVerified: false,
        role: "MERCHANT",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    testMerchant = await prisma.merchant.create({
      data: {
        id: "test-merchant-order",
        ownerId: merchantOwner.id,
        name: "Test Restaurant Order",
        latitude: -6.2088,
        longitude: 106.8456,
        isOpen: true,
        approvalStatus: "APPROVED",
      },
    });

    const category = await prisma.merchantMenuCategory.create({
      data: {
        id: "test-category-order",
        name: "Main Course",
        merchantId: testMerchant.id,
      },
    });

    const menu = await prisma.menu.create({
      data: {
        id: "test-menu-order",
        name: "Test Pizza",
        price: 50000,
        merchantId: testMerchant.id,
        categoryId: category.id,
        isAvailable: true,
      },
    });

    testMenuVariant = await prisma.menuVariant.create({
      data: {
        id: "test-variant-order",
        name: "Regular",
        price: 50000,
        menuId: menu.id,
      },
    });
  });

  afterAll(async () => {
    try {
      await prisma.orderStatusHistory.deleteMany({});
      await prisma.orderItem.deleteMany({});
      await prisma.cartItem.deleteMany({});
      await prisma.cart.deleteMany({});
      await prisma.order.deleteMany({});
      await prisma.menuVariant.deleteMany({ where: { id: testMenuVariant?.id } });
      await prisma.menu.deleteMany({ where: { id: "test-menu-order" } });
      await prisma.merchantMenuCategory.deleteMany({ where: { id: "test-category-order" } });
      await prisma.merchant.deleteMany({ where: { id: testMerchant?.id } });
      await prisma.user.deleteMany({
        where: { id: { in: ["test-user-order", "merchant-owner-order"] } },
      });
    } catch {
      // Ignore cleanup errors
    }
    await app.close();
  });

  describe("Complete Order Flow", () => {
    let cartId: string;
    let orderId: string;

    it("should get merchants list", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/merchants")
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should get merchant by ID", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/merchants/${testMerchant.id}`)
        .expect(200);

      expect(response.body.id).toBe(testMerchant.id);
      expect(response.body.name).toBe("Test Restaurant Order");
    });

    it("should get merchant menus", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/merchants/${testMerchant.id}/menus`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
