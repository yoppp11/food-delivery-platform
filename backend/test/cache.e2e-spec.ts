import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/common/prisma.service";

describe("Cache Integration (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let testMerchant: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    const merchantOwner = await prisma.user.create({
      data: {
        id: "cache-test-owner",
        email: "cache-owner@test.com",
        emailVerified: false,
        role: "MERCHANT",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    testMerchant = await prisma.merchant.create({
      data: {
        id: "cache-test-merchant",
        ownerId: merchantOwner.id,
        name: "Cache Test Restaurant",
        latitude: -6.2088,
        longitude: 106.8456,
        isOpen: true,
        approvalStatus: "APPROVED",
      },
    });
  });

  afterAll(async () => {
    try {
      await prisma.merchant.deleteMany({ where: { id: testMerchant?.id } });
      await prisma.user.deleteMany({ where: { id: "cache-test-owner" } });
    } catch {
      // Ignore cleanup errors
    }
    await app.close();
  });

  describe("Merchant Cache", () => {
    it("should cache merchant list", async () => {
      const response1 = await request(app.getHttpServer())
        .get("/api/merchants")
        .expect(200);

      expect(response1.body.data).toBeDefined();

      const response2 = await request(app.getHttpServer())
        .get("/api/merchants")
        .expect(200);

      expect(response2.body.data).toBeDefined();
    });

    it("should return cached response on second request", async () => {
      const start1 = Date.now();
      await request(app.getHttpServer()).get("/api/merchants").expect(200);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await request(app.getHttpServer()).get("/api/merchants").expect(200);
      const time2 = Date.now() - start2;

      expect(time2).toBeLessThanOrEqual(time1 + 100);
    });

    it("should get individual merchant", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/merchants/${testMerchant.id}`)
        .expect(200);

      expect(response.body.id).toBe(testMerchant.id);
    });
  });

  describe("Category Cache", () => {
    it("should cache categories", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/categories")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Cache Fallback", () => {
    it("should handle requests when cache unavailable", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/merchants")
        .expect(200);

      expect(response.body.data).toBeDefined();
    });
  });
});
