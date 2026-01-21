import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { MerchantService } from "./merchant.service";
import { PrismaService } from "../../common/prisma.service";
import { CacheService, CacheInvalidationService } from "../../common/cache";
import { Role } from "@prisma/client";

describe("MerchantService", () => {
  let service: MerchantService;
  let prisma: PrismaService;
  let cacheService: CacheService;
  let cacheInvalidation: CacheInvalidationService;

  const mockPrisma = {
    merchant: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    merchantReview: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    merchantOperationalHour: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    generateHashKey: jest.fn(),
  };

  const mockCacheInvalidation = {
    invalidateMerchantCache: jest.fn(),
    invalidateMenuCache: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  const mockUser = {
    id: "user-123",
    email: "test@test.com",
    role: "CUSTOMER" as Role,
  };

  const mockMerchant = {
    id: "merchant-123",
    ownerId: "user-123",
    name: "Test Restaurant",
    description: "Test Description",
    latitude: -6.2088,
    longitude: 106.8456,
    isOpen: true,
    rating: 4.5,
    merchantReviews: [{ id: "review-1" }],
    approvalStatus: "APPROVED",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CacheService, useValue: mockCacheService },
        { provide: CacheInvalidationService, useValue: mockCacheInvalidation },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<MerchantService>(MerchantService);
    prisma = module.get<PrismaService>(PrismaService);
    cacheService = module.get<CacheService>(CacheService);
    cacheInvalidation = module.get<CacheInvalidationService>(CacheInvalidationService);

    jest.clearAllMocks();
  });

  describe("getAllMerchants", () => {
    it("should return paginated merchants", async () => {
      const merchants = [mockMerchant];
      mockPrisma.$transaction.mockResolvedValue([merchants, 1]);

      const result = await service.getAllMerchants({
        page: 1,
        limit: 20,
      });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it("should filter by isOpen", async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0]);

      await service.getAllMerchants({
        page: 1,
        limit: 20,
        isOpen: "true",
      });

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it("should search by name", async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0]);

      await service.getAllMerchants({
        page: 1,
        limit: 20,
        search: "Pizza",
      });

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it("should handle empty results", async () => {
      mockPrisma.$transaction.mockResolvedValue([[], 0]);

      const result = await service.getAllMerchants({
        page: 1,
        limit: 20,
      });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe("getMerchantById", () => {
    it("should return merchant with relations", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.merchant.findUnique.mockResolvedValue({
        ...mockMerchant,
        merchantOperationalHours: [],
        merchantCategories: [],
        merchantReviews: [],
      });

      const result = await service.getMerchantById("merchant-123");

      expect(result.id).toBe("merchant-123");
      expect(mockPrisma.merchant.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "merchant-123" },
        }),
      );
    });

    it("should throw NotFoundException for invalid id", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.merchant.findUnique.mockResolvedValue(null);

      await expect(service.getMerchantById("invalid-id")).rejects.toThrow(
        new HttpException("Merchant not found", HttpStatus.NOT_FOUND),
      );
    });

    it("should cache response", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.merchant.findUnique.mockResolvedValue({
        ...mockMerchant,
        merchantOperationalHours: [],
        merchantCategories: [],
        merchantReviews: [],
      });

      await service.getMerchantById("merchant-123");

      expect(mockCacheService.set).toHaveBeenCalled();
    });

    it("should return cached value if available", async () => {
      const cachedMerchant = { ...mockMerchant, fromCache: true };
      mockCacheService.get.mockResolvedValue(cachedMerchant);

      const result = await service.getMerchantById("merchant-123");

      expect(result).toEqual(cachedMerchant);
      expect(mockPrisma.merchant.findUnique).not.toHaveBeenCalled();
    });

    it("should throw BadRequest if ID is empty", async () => {
      await expect(service.getMerchantById("")).rejects.toThrow(
        new HttpException("ID is required", HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe("updateMerchant", () => {
    it("should update merchant fields", async () => {
      mockPrisma.merchant.findUnique.mockResolvedValue(mockMerchant);
      mockPrisma.merchant.update.mockResolvedValue({
        ...mockMerchant,
        name: "Updated Name",
      });

      const result = await service.updateMerchant(
        "merchant-123",
        { name: "Updated Name" },
        mockUser as any,
      );

      expect(result.name).toBe("Updated Name");
      expect(mockPrisma.merchant.update).toHaveBeenCalled();
    });

    it("should invalidate cache on update", async () => {
      mockPrisma.merchant.findUnique.mockResolvedValue(mockMerchant);
      mockPrisma.merchant.update.mockResolvedValue(mockMerchant);

      await service.updateMerchant("merchant-123", { name: "New Name" }, mockUser as any);

      expect(mockCacheInvalidation.invalidateMerchantCache).toHaveBeenCalledWith("merchant-123");
    });

    it("should throw Forbidden if not owner or admin", async () => {
      mockPrisma.merchant.findUnique.mockResolvedValue({
        ...mockMerchant,
        ownerId: "other-user",
      });

      await expect(
        service.updateMerchant("merchant-123", { name: "New Name" }, mockUser as any),
      ).rejects.toThrow(new HttpException("Forbidden access", HttpStatus.FORBIDDEN));
    });
  });

  describe("deleteMerchant", () => {
    it("should delete merchant", async () => {
      mockPrisma.merchant.findUnique.mockResolvedValue(mockMerchant);
      mockPrisma.merchant.delete.mockResolvedValue(mockMerchant);

      const result = await service.deleteMerchant("merchant-123", mockUser as any);

      expect(result.id).toBe("merchant-123");
    });

    it("should invalidate cache", async () => {
      mockPrisma.merchant.findUnique.mockResolvedValue(mockMerchant);
      mockPrisma.merchant.delete.mockResolvedValue(mockMerchant);

      await service.deleteMerchant("merchant-123", mockUser as any);

      expect(mockCacheInvalidation.invalidateMerchantCache).toHaveBeenCalledWith("merchant-123");
    });
  });

  describe("getFeaturedMerchants", () => {
    it("should return top rated merchants", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.merchant.findMany.mockResolvedValue([mockMerchant]);

      const result = await service.getFeaturedMerchants(10);

      expect(result).toHaveLength(1);
      expect(mockPrisma.merchant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { rating: "desc" },
          take: 10,
        }),
      );
    });

    it("should respect limit parameter", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.merchant.findMany.mockResolvedValue([]);

      await service.getFeaturedMerchants(5);

      expect(mockPrisma.merchant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });

    it("should only include open merchants", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.merchant.findMany.mockResolvedValue([]);

      await service.getFeaturedMerchants(10);

      expect(mockPrisma.merchant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isOpen: true },
        }),
      );
    });
  });

  describe("getNearbyMerchants", () => {
    it("should filter by maxDistance", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.merchant.findMany.mockResolvedValue([
        { ...mockMerchant, latitude: -6.2088, longitude: 106.8456 },
      ]);

      const result = await service.getNearbyMerchants(-6.2088, 106.8456, 10);

      expect(result).toBeDefined();
    });

    it("should order by distance ascending", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.merchant.findMany.mockResolvedValue([
        { ...mockMerchant, id: "far", latitude: -6.5, longitude: 107.0 },
        { ...mockMerchant, id: "near", latitude: -6.21, longitude: 106.85 },
      ]);

      const result = await service.getNearbyMerchants(-6.2088, 106.8456, 50);

      if (result.length > 1) {
        expect(result[0].distance).toBeLessThanOrEqual(result[1].distance);
      }
    });
  });

  describe("toggleStatus", () => {
    it("should toggle isOpen status", async () => {
      mockPrisma.merchant.findUnique.mockResolvedValue(mockMerchant);
      mockPrisma.merchant.update.mockResolvedValue({
        ...mockMerchant,
        isOpen: false,
      });

      const result = await service.toggleStatus("merchant-123", mockUser as any);

      expect(result.isOpen).toBe(false);
    });
  });
});
