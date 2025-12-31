import type {
  User,
  Category,
  Merchant,
  Menu,
  Order,
  Notification,
  Promotion,
  MerchantReview,
  UserAddress,
} from '@/types';
import {
  mockUser,
  mockCategories,
  mockMerchants,
  mockMenus,
  mockOrders,
  mockNotifications,
  mockPromotions,
  mockReviews,
  mockAddresses,
} from '@/data/mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// User API
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    await delay(500);
    return mockUser;
  },
  updateUser: async (data: Partial<User>): Promise<User> => {
    await delay(500);
    return { ...mockUser, ...data };
  },
};

// Category API
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    await delay(300);
    return mockCategories;
  },
  getById: async (id: string): Promise<Category | undefined> => {
    await delay(300);
    return mockCategories.find((c) => c.id === id);
  },
};

// Merchant API
export const merchantApi = {
  getAll: async (): Promise<Merchant[]> => {
    await delay(500);
    return mockMerchants;
  },
  getById: async (id: string): Promise<Merchant | undefined> => {
    await delay(300);
    const merchant = mockMerchants.find((m) => m.id === id);
    if (merchant) {
      return {
        ...merchant,
        menus: mockMenus.filter((menu) => menu.merchantId === id),
        reviews: mockReviews.filter((review) => review.merchantId === id),
      };
    }
    return undefined;
  },
  getFeatured: async (): Promise<Merchant[]> => {
    await delay(400);
    return mockMerchants.filter((m) => m.isOpen).slice(0, 6);
  },
  search: async (query: string): Promise<Merchant[]> => {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return mockMerchants.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.description?.toLowerCase().includes(lowerQuery)
    );
  },
  getByCategory: async (categoryId: string): Promise<Merchant[]> => {
    await delay(400);
    const menuMerchantIds = new Set(
      mockMenus.filter((m) => m.categoryId === categoryId).map((m) => m.merchantId)
    );
    return mockMerchants.filter((m) => menuMerchantIds.has(m.id));
  },
};

// Menu API
export const menuApi = {
  getByMerchant: async (merchantId: string): Promise<Menu[]> => {
    await delay(300);
    return mockMenus.filter((m) => m.merchantId === merchantId);
  },
  getById: async (id: string): Promise<Menu | undefined> => {
    await delay(200);
    return mockMenus.find((m) => m.id === id);
  },
  search: async (query: string): Promise<Menu[]> => {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return mockMenus.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery)
    );
  },
};

// Order API
export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    await delay(500);
    return mockOrders;
  },
  getById: async (id: string): Promise<Order | undefined> => {
    await delay(300);
    return mockOrders.find((o) => o.id === id);
  },
  getActive: async (): Promise<Order[]> => {
    await delay(400);
    return mockOrders.filter((o) =>
      ['CREATED', 'PAID', 'PREPARING', 'READY', 'ON_DELIVERY'].includes(o.status)
    );
  },
  create: async (data: Partial<Order>): Promise<Order> => {
    await delay(800);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: '1',
      merchantId: data.merchantId || '1',
      driverId: 'driver-1',
      status: 'CREATED',
      totalPrice: data.totalPrice || 0,
      deliveryFee: data.deliveryFee || 15000,
      paymentStatus: 'PENDING',
      items: data.items || [],
    };
    return newOrder;
  },
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    await delay(500);
    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    return { ...order, status };
  },
};

// Notification API
export const notificationApi = {
  getAll: async (): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications;
  },
  getUnread: async (): Promise<Notification[]> => {
    await delay(200);
    return mockNotifications.filter((n) => !n.isRead);
  },
  markAsRead: async (id: string): Promise<Notification> => {
    await delay(200);
    const notification = mockNotifications.find((n) => n.id === id);
    if (!notification) throw new Error('Notification not found');
    return { ...notification, isRead: true };
  },
  markAllAsRead: async (): Promise<void> => {
    await delay(300);
  },
};

// Promotion API
export const promotionApi = {
  getAll: async (): Promise<Promotion[]> => {
    await delay(300);
    return mockPromotions;
  },
  getActive: async (): Promise<Promotion[]> => {
    await delay(300);
    const now = new Date();
    return mockPromotions.filter((p) => new Date(p.expiredAt) > now);
  },
  validateCode: async (code: string): Promise<Promotion | null> => {
    await delay(400);
    const promotion = mockPromotions.find(
      (p) => p.code === code && new Date(p.expiredAt) > new Date()
    );
    return promotion || null;
  },
};

// Review API
export const reviewApi = {
  getByMerchant: async (merchantId: string): Promise<MerchantReview[]> => {
    await delay(300);
    return mockReviews.filter((r) => r.merchantId === merchantId);
  },
  create: async (data: Partial<MerchantReview>): Promise<MerchantReview> => {
    await delay(500);
    return {
      id: `review-${Date.now()}`,
      userId: '1',
      merchantId: data.merchantId || '1',
      rating: data.rating || 5,
      comment: data.comment || '',
      createdAt: new Date(),
    };
  },
};

// Address API
export const addressApi = {
  getAll: async (): Promise<UserAddress[]> => {
    await delay(300);
    return mockAddresses;
  },
  getDefault: async (): Promise<UserAddress | undefined> => {
    await delay(200);
    return mockAddresses.find((a) => a.isDefault);
  },
  create: async (data: Partial<UserAddress>): Promise<UserAddress> => {
    await delay(500);
    return {
      id: `addr-${Date.now()}`,
      userId: '1',
      label: data.label || 'New Address',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      address: data.address || '',
      isDefault: data.isDefault || false,
    };
  },
  update: async (id: string, data: Partial<UserAddress>): Promise<UserAddress> => {
    await delay(400);
    const address = mockAddresses.find((a) => a.id === id);
    if (!address) throw new Error('Address not found');
    return { ...address, ...data };
  },
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockAddresses.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Address not found');
  },
};
