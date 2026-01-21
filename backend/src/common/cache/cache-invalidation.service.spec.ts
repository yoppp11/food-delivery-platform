import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { CacheInvalidationService } from "./cache-invalidation.service";

jest.mock("ioredis");

describe("CacheInvalidationService", () => {
  let service: CacheInvalidationService;

  const mockCacheManager = {
    del: jest.fn(),
  };

  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheInvalidationService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<CacheInvalidationService>(CacheInvalidationService);

    jest.clearAllMocks();
  });

  describe("invalidateKeys", () => {
    it("should delete all specified keys", async () => {
      mockCacheManager.del.mockResolvedValue(undefined);

      await service.invalidateKeys("key1", "key2", "key3");

      expect(mockCacheManager.del).toHaveBeenCalledTimes(3);
      expect(mockCacheManager.del).toHaveBeenCalledWith("key1");
      expect(mockCacheManager.del).toHaveBeenCalledWith("key2");
      expect(mockCacheManager.del).toHaveBeenCalledWith("key3");
    });
  });

  describe("invalidateMerchantCache", () => {
    it("should invalidate merchant related caches", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidateMerchantCache("merchant-123");

      expect(invalidatePatternSpy).toHaveBeenCalledWith("merchant:merchant-123*");
      expect(invalidatePatternSpy).toHaveBeenCalledWith("merchants:*");
    });
  });

  describe("invalidateMenuCache", () => {
    it("should invalidate menu related caches", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidateMenuCache("merchant-123");

      expect(invalidatePatternSpy).toHaveBeenCalledWith("menu:*");
      expect(invalidatePatternSpy).toHaveBeenCalledWith("menus:*");
      expect(invalidatePatternSpy).toHaveBeenCalledWith("merchant:merchant-123:menus*");
    });
  });

  describe("invalidateCategoryCache", () => {
    it("should invalidate category caches", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidateCategoryCache();

      expect(invalidatePatternSpy).toHaveBeenCalledWith("categories:*");
      expect(invalidatePatternSpy).toHaveBeenCalledWith("category:*");
    });
  });

  describe("invalidateUserCache", () => {
    it("should invalidate user caches", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidateUserCache("user-123");

      expect(invalidatePatternSpy).toHaveBeenCalledWith("user:user-123*");
    });
  });

  describe("invalidateDriverCache", () => {
    it("should invalidate driver caches with driverId", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidateDriverCache("driver-123");

      expect(invalidatePatternSpy).toHaveBeenCalledWith("driver:driver-123*");
      expect(invalidatePatternSpy).toHaveBeenCalledWith("drivers:*");
    });

    it("should invalidate all driver caches without driverId", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidateDriverCache();

      expect(invalidatePatternSpy).toHaveBeenCalledWith("drivers:*");
    });
  });

  describe("invalidatePromotionCache", () => {
    it("should invalidate promotion caches", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidatePromotionCache();

      expect(invalidatePatternSpy).toHaveBeenCalledWith("promotions:*");
      expect(invalidatePatternSpy).toHaveBeenCalledWith("promotion:*");
    });
  });

  describe("invalidateNotificationCache", () => {
    it("should invalidate notification caches for user", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidateNotificationCache("user-123");

      expect(invalidatePatternSpy).toHaveBeenCalledWith("notifications:user:user-123*");
    });
  });

  describe("invalidateAdminCache", () => {
    it("should invalidate admin caches", async () => {
      const invalidatePatternSpy = jest.spyOn(service, "invalidatePattern").mockResolvedValue();

      await service.invalidateAdminCache();

      expect(invalidatePatternSpy).toHaveBeenCalledWith("admin:*");
    });
  });
});
