import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { OrderService } from "./order.service";
import { PrismaService } from "../../common/prisma.service";
import { CartService } from "../cart/cart.service";
import { Role } from "@prisma/client";

describe("OrderService", () => {
  let service: OrderService;
  let prisma: PrismaService;
  let cartService: CartService;

  const mockPrisma = {
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    orderItem: {
      createMany: jest.fn(),
    },
    orderStatusHistory: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    cart: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    menuVariant: {
      findMany: jest.fn(),
    },
    merchant: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockCartService = {
    getAll: jest.fn(),
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

  const mockOrder = {
    id: "order-123",
    userId: "user-123",
    merchantId: "merchant-123",
    status: "CREATED",
    totalPrice: 50000,
    paymentStatus: "PENDING",
    items: [],
    createdAt: new Date(),
  };

  const mockCart = {
    id: "cart-123",
    userId: "user-123",
    merchantId: "merchant-123",
    status: "ACTIVE",
    subtotal: 50000,
    cartItems: [
      {
        id: "item-1",
        variantId: "variant-1",
        quantity: 2,
        basePrice: 25000,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CartService, useValue: mockCartService },
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);
    cartService = module.get<CartService>(CartService);

    jest.clearAllMocks();
  });

  describe("getOrders", () => {
    it("should return user orders", async () => {
      mockPrisma.order.findMany.mockResolvedValue([mockOrder]);

      const result = await service.getOrders(mockUser as any);

      expect(result).toHaveLength(1);
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUser.id },
        }),
      );
    });

    it("should include order items", async () => {
      mockPrisma.order.findMany.mockResolvedValue([{ ...mockOrder, items: [] }]);

      const result = await service.getOrders(mockUser as any);

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { items: true },
        }),
      );
    });
  });

  describe("createOrder", () => {
    beforeEach(() => {
      mockPrisma.cart.findFirst.mockResolvedValue(mockCart);
      mockPrisma.menuVariant.findMany.mockResolvedValue([
        { id: "variant-1", menu: { isAvailable: true } },
      ]);
      mockPrisma.merchant.findFirst.mockResolvedValue({
        id: "merchant-123",
        isOpen: true,
        user: {},
      });
      mockPrisma.$transaction.mockImplementation((fn) => fn(mockPrisma));
      mockPrisma.order.create.mockResolvedValue({ ...mockOrder, items: [] });
    });

    it("should create order from cart", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(mockCart);

      const result = await service.createOrder(
        { merchantId: "merchant-123" },
        mockUser as any,
      );

      expect(result).toBeDefined();
    });

    it("should throw if cart not found", async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(null);

      await expect(
        service.createOrder({ merchantId: "merchant-123" }, mockUser as any),
      ).rejects.toThrow(new HttpException("Cart not found", HttpStatus.NOT_FOUND));
    });

    it("should throw if merchant is closed", async () => {
      mockPrisma.merchant.findFirst.mockResolvedValue({
        id: "merchant-123",
        isOpen: false,
      });

      await expect(
        service.createOrder({ merchantId: "merchant-123" }, mockUser as any),
      ).rejects.toThrow(new HttpException("Merchant is closed", HttpStatus.BAD_REQUEST));
    });
  });

  describe("getById", () => {
    it("should return order with items", async () => {
      mockPrisma.order.findFirst.mockResolvedValue(mockOrder);

      const result = await service.getById("order-123");

      expect(result.id).toBe("order-123");
    });

    it("should throw NotFoundException", async () => {
      mockPrisma.order.findFirst.mockResolvedValue(null);

      await expect(service.getById("invalid")).rejects.toThrow(
        new HttpException("Order not found", HttpStatus.NOT_FOUND),
      );
    });

    it("should throw BadRequest if ID is empty", async () => {
      await expect(service.getById("")).rejects.toThrow(
        new HttpException("ID is required", HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe("editStatus", () => {
    it("should update order status", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ ...mockOrder, status: "CREATED" });
      mockPrisma.$transaction.mockImplementation((fn) => fn(mockPrisma));
      mockPrisma.order.update.mockResolvedValue({ ...mockOrder, status: "PAID" });

      const result = await service.editStatus("order-123", "PAID", mockUser as any);

      expect(result.status).toBe("PAID");
    });

    it("should validate status transition", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ ...mockOrder, status: "COMPLETED" });

      await expect(
        service.editStatus("order-123", "CANCELLED", mockUser as any),
      ).rejects.toThrow(HttpException);
    });

    it("should prevent invalid transitions", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ ...mockOrder, status: "CREATED" });

      await expect(
        service.editStatus("order-123", "COMPLETED", mockUser as any),
      ).rejects.toThrow(HttpException);
    });
  });

  describe("cancelledOrder", () => {
    it("should cancel if status is CREATED", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ ...mockOrder, status: "CREATED" });
      mockPrisma.$transaction.mockImplementation((fn) => fn(mockPrisma));
      mockPrisma.order.update.mockResolvedValue({ ...mockOrder, status: "CANCELLED" });

      const result = await service.cancelledOrder("order-123", mockUser as any);

      expect(result.status).toBe("CANCELLED");
    });

    it("should cancel if status is PAID", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ ...mockOrder, status: "PAID" });
      mockPrisma.$transaction.mockImplementation((fn) => fn(mockPrisma));
      mockPrisma.order.update.mockResolvedValue({
        ...mockOrder,
        status: "CANCELLED",
        paymentStatus: "REFUNDED",
      });

      const result = await service.cancelledOrder("order-123", mockUser as any);

      expect(result.status).toBe("CANCELLED");
    });

    it("should fail if order is PREPARING", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ ...mockOrder, status: "PREPARING" });

      await expect(service.cancelledOrder("order-123", mockUser as any)).rejects.toThrow(
        new HttpException("Order can't be cancelled", HttpStatus.BAD_REQUEST),
      );
    });
  });
});
