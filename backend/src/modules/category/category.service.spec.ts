import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { CategoryService } from "./category.service";
import { PrismaService } from "../../common/prisma.service";
import { CacheService, CacheInvalidationService } from "../../common/cache";

describe("CategoryService", () => {
  let service: CategoryService;
  let prisma: PrismaService;
  let cacheService: CacheService;
  let cacheInvalidation: CacheInvalidationService;

  const mockPrisma = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockCacheInvalidation = {
    invalidateCategoryCache: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  const mockCategory = {
    id: "category-123",
    name: "Pizza",
    description: "Italian pizza",
    iconUrl: "pizza.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CacheService, useValue: mockCacheService },
        { provide: CacheInvalidationService, useValue: mockCacheInvalidation },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
    cacheService = module.get<CacheService>(CacheService);
    cacheInvalidation = module.get<CacheInvalidationService>(CacheInvalidationService);

    jest.clearAllMocks();
  });

  describe("getAllCategories", () => {
    it("should return all categories", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.getAllCategories();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Pizza");
    });

    it("should cache response for 30 minutes", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      await service.getAllCategories();

      expect(mockCacheService.set).toHaveBeenCalledWith(
        "categories:all",
        expect.any(Array),
        1800000,
      );
    });

    it("should return cached value if available", async () => {
      const cachedCategories = [{ ...mockCategory, merchantCount: 5 }];
      mockCacheService.get.mockResolvedValue(cachedCategories);

      const result = await service.getAllCategories();

      expect(result).toEqual(cachedCategories);
      expect(mockPrisma.category.findMany).not.toHaveBeenCalled();
    });
  });

  describe("getCategoryById", () => {
    it("should return category", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById("category-123");

      expect(result.id).toBe("category-123");
    });

    it("should throw NotFoundException", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.getCategoryById("invalid")).rejects.toThrow(
        new HttpException("Category not found", HttpStatus.NOT_FOUND),
      );
    });

    it("should throw BadRequest if ID is empty", async () => {
      await expect(service.getCategoryById("")).rejects.toThrow(
        new HttpException("ID is required", HttpStatus.BAD_REQUEST),
      );
    });

    it("should cache response", async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);

      await service.getCategoryById("category-123");

      expect(mockCacheService.set).toHaveBeenCalled();
    });
  });

  describe("createCategory", () => {
    it("should create category", async () => {
      mockPrisma.category.create.mockResolvedValue(mockCategory);

      const result = await service.createCategory({
        name: "Pizza",
        description: "Italian pizza",
      });

      expect(result.name).toBe("Pizza");
    });

    it("should invalidate cache on create", async () => {
      mockPrisma.category.create.mockResolvedValue(mockCategory);

      await service.createCategory({ name: "Pizza" });

      expect(mockCacheInvalidation.invalidateCategoryCache).toHaveBeenCalled();
    });
  });

  describe("updateCategory", () => {
    it("should update category", async () => {
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);
      mockPrisma.category.update.mockResolvedValue({
        ...mockCategory,
        name: "Updated Pizza",
      });

      const result = await service.updateCategory("category-123", {
        name: "Updated Pizza",
      });

      expect(result.name).toBe("Updated Pizza");
    });

    it("should invalidate cache on update", async () => {
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);
      mockPrisma.category.update.mockResolvedValue(mockCategory);

      await service.updateCategory("category-123", { name: "New Name" });

      expect(mockCacheInvalidation.invalidateCategoryCache).toHaveBeenCalled();
    });

    it("should throw NotFoundException", async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(
        service.updateCategory("invalid", { name: "Test" }),
      ).rejects.toThrow(new HttpException("Category not found", HttpStatus.NOT_FOUND));
    });
  });

  describe("deleteCategory", () => {
    it("should delete category", async () => {
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);
      mockPrisma.category.delete.mockResolvedValue(mockCategory);

      const result = await service.deleteCategory("category-123");

      expect(result.id).toBe("category-123");
    });

    it("should invalidate cache on delete", async () => {
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);
      mockPrisma.category.delete.mockResolvedValue(mockCategory);

      await service.deleteCategory("category-123");

      expect(mockCacheInvalidation.invalidateCategoryCache).toHaveBeenCalled();
    });
  });
});
