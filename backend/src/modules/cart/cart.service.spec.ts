import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { CartService } from "./cart.service";
import { PrismaService } from "../../common/prisma.service";

describe("CartService", () => {
  let service: CartService;
  let prisma: PrismaService;

  const mockPrisma = {
    cart: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  const mockUser = {
    id: "user-123",
    email: "test@test.com",
  };

  const mockCart = {
    id: "cart-123",
    userId: "user-123",
    merchantId: "merchant-123",
    status: "ACTIVE",
    subtotal: 50000,
    cartItems: [],
  };

  const mockCartItem = {
    id: "item-123",
    cartId: "cart-123",
    variantId: "variant-123",
    quantity: 2,
    basePrice: 25000,
    itemTotal: 50000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return active cart for user", async () => {
      mockPrisma.cart.findMany.mockResolvedValue([mockCart]);

      const result = await service.getAll("user-123");

      expect(result).toHaveLength(1);
      expect(mockPrisma.cart.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-123", status: "ACTIVE" },
        }),
      );
    });

    it("should include cart items with menu variants", async () => {
      mockPrisma.cart.findMany.mockResolvedValue([]);

      await service.getAll("user-123");

      expect(mockPrisma.cart.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            cartItems: expect.any(Object),
          }),
        }),
      );
    });
  });

  describe("postCart", () => {
    it("should create new cart if none exists", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(null);
      mockPrisma.cart.create.mockResolvedValue(mockCart);

      const result = await service.postCart(
        { merchantId: "merchant-123", variantId: "variant-123", quantity: 1 },
        mockUser as any,
      );

      expect(result).toBeDefined();
    });

    it("should update existing cart", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ ...mockCart, cartItems: [] });
      mockPrisma.cart.update.mockResolvedValue(mockCart);
      mockPrisma.cartItem.create.mockResolvedValue(mockCartItem);

      const result = await service.postCart(
        { merchantId: "merchant-123", variantId: "variant-123", quantity: 1 },
        mockUser as any,
      );

      expect(result).toBeDefined();
    });

    it("should clear cart if different merchant", async () => {
      mockPrisma.cart.findFirst
        .mockResolvedValueOnce({ ...mockCart, merchantId: "other-merchant", cartItems: [] })
        .mockResolvedValueOnce(null);
      mockPrisma.cart.delete.mockResolvedValue({});
      mockPrisma.cartItem.deleteMany.mockResolvedValue({});
      mockPrisma.cart.create.mockResolvedValue(mockCart);

      await service.postCart(
        { merchantId: "merchant-123", variantId: "variant-123", quantity: 1 },
        mockUser as any,
      );

      expect(mockPrisma.cart.delete).toHaveBeenCalled();
    });
  });

  describe("editQuantity", () => {
    it("should update item quantity on INCREMENT", async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue(mockCartItem);
      mockPrisma.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 3,
        itemTotal: 75000,
      });

      const result = await service.editQuantity("item-123", "INCREMENT", 1);

      expect(result.quantity).toBe(3);
    });

    it("should update item quantity on DECREMENT", async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue(mockCartItem);
      mockPrisma.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 1,
        itemTotal: 25000,
      });

      const result = await service.editQuantity("item-123", "DECREMENT", 1);

      expect(result.quantity).toBe(1);
    });

    it("should not go below 1 on DECREMENT", async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue({ ...mockCartItem, quantity: 1 });
      mockPrisma.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 1,
      });

      const result = await service.editQuantity("item-123", "DECREMENT", 1);

      expect(result.quantity).toBeGreaterThanOrEqual(1);
    });

    it("should throw if cart item not found", async () => {
      mockPrisma.cartItem.findUnique.mockResolvedValue(null);

      await expect(service.editQuantity("invalid", "INCREMENT", 1)).rejects.toThrow(
        new HttpException("Cart item not found", HttpStatus.NOT_FOUND),
      );
    });

    it("should throw if quantity is less than 1", async () => {
      await expect(service.editQuantity("item-123", "INCREMENT", 0)).rejects.toThrow(
        new HttpException("Quantity must be at least 1", HttpStatus.BAD_REQUEST),
      );
    });
  });
});
