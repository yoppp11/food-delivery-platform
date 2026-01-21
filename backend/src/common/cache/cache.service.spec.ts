import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { CacheService } from "./cache.service";
import { Cache } from "cache-manager";

describe("CacheService", () => {
  let service: CacheService;
  let cacheManager: Cache;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get(CACHE_MANAGER);

    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should return cached value", async () => {
      const testValue = { id: 1, name: "test" };
      mockCacheManager.get.mockResolvedValue(testValue);

      const result = await service.get("test-key");

      expect(result).toEqual(testValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith("test-key");
      expect(mockLogger.debug).toHaveBeenCalledWith("Cache HIT: test-key");
    });

    it("should return null for missing key", async () => {
      mockCacheManager.get.mockResolvedValue(undefined);

      const result = await service.get("missing-key");

      expect(result).toBeNull();
      expect(mockLogger.debug).toHaveBeenCalledWith("Cache MISS: missing-key");
    });

    it("should handle connection errors gracefully", async () => {
      mockCacheManager.get.mockRejectedValue(new Error("Connection failed"));

      const result = await service.get("error-key");

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("set", () => {
    it("should store value with TTL", async () => {
      mockCacheManager.set.mockResolvedValue(undefined);

      await service.set("test-key", { data: "value" }, 60000);

      expect(mockCacheManager.set).toHaveBeenCalledWith("test-key", { data: "value" }, 60000);
      expect(mockLogger.debug).toHaveBeenCalledWith("Cache SET: test-key (TTL: 60000ms)");
    });

    it("should handle large objects", async () => {
      const largeObject = { items: Array(1000).fill({ id: 1, name: "test" }) };
      mockCacheManager.set.mockResolvedValue(undefined);

      await service.set("large-key", largeObject, 30000);

      expect(mockCacheManager.set).toHaveBeenCalledWith("large-key", largeObject, 30000);
    });
  });

  describe("delete", () => {
    it("should remove cached key", async () => {
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.delete("test-key");

      expect(result).toBe(true);
      expect(mockCacheManager.del).toHaveBeenCalledWith("test-key");
      expect(mockLogger.debug).toHaveBeenCalledWith("Cache DELETE: test-key");
    });

    it("should return false on error", async () => {
      mockCacheManager.del.mockRejectedValue(new Error("Delete failed"));

      const result = await service.delete("error-key");

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("getOrSet", () => {
    it("should return cached value if exists", async () => {
      const cachedValue = { id: 1 };
      mockCacheManager.get.mockResolvedValue(cachedValue);
      const factory = jest.fn();

      const result = await service.getOrSet("existing-key", factory, 60000);

      expect(result).toEqual(cachedValue);
      expect(factory).not.toHaveBeenCalled();
    });

    it("should call factory if cache miss", async () => {
      const newValue = { id: 2 };
      mockCacheManager.get.mockResolvedValue(null);
      mockCacheManager.set.mockResolvedValue(undefined);
      const factory = jest.fn().mockResolvedValue(newValue);

      const result = await service.getOrSet("new-key", factory, 60000);

      expect(result).toEqual(newValue);
      expect(factory).toHaveBeenCalled();
      expect(mockCacheManager.set).toHaveBeenCalledWith("new-key", newValue, 60000);
    });

    it("should cache factory result", async () => {
      const newValue = { id: 3 };
      mockCacheManager.get.mockResolvedValue(null);
      mockCacheManager.set.mockResolvedValue(undefined);
      const factory = jest.fn().mockResolvedValue(newValue);

      await service.getOrSet("cache-key", factory, 30000);

      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe("generateHashKey", () => {
    it("should generate consistent hash for same params", () => {
      const params = { page: 1, limit: 20, search: "test" };

      const key1 = service.generateHashKey("prefix", params);
      const key2 = service.generateHashKey("prefix", params);

      expect(key1).toBe(key2);
      expect(key1).toMatch(/^prefix:/);
    });

    it("should generate different hash for different params", () => {
      const params1 = { page: 1 };
      const params2 = { page: 2 };

      const key1 = service.generateHashKey("prefix", params1);
      const key2 = service.generateHashKey("prefix", params2);

      expect(key1).not.toBe(key2);
    });
  });
});
