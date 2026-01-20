export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  merchants: {
    all: ['merchants'] as const,
    lists: () => [...queryKeys.merchants.all, 'list'] as const,
    list: (filters?: { search?: string; page?: number; limit?: number; categoryId?: string }) =>
      [...queryKeys.merchants.lists(), filters] as const,
    details: () => [...queryKeys.merchants.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.merchants.details(), id] as const,
    featured: (limit?: number) => [...queryKeys.merchants.all, 'featured', limit] as const,
    nearby: (lat: number, lng: number, maxDistance?: number) =>
      [...queryKeys.merchants.all, 'nearby', { lat, lng, maxDistance }] as const,
    menus: (merchantId: string) => [...queryKeys.merchants.detail(merchantId), 'menus'] as const,
    reviews: (merchantId: string, page?: number) =>
      [...queryKeys.merchants.detail(merchantId), 'reviews', page] as const,
    operationalHours: (merchantId: string) =>
      [...queryKeys.merchants.detail(merchantId), 'operational-hours'] as const,
  },

  categories: {
    all: ['categories'] as const,
    detail: (id: string) => [...queryKeys.categories.all, id] as const,
  },

  menus: {
    all: ['menus'] as const,
    lists: () => [...queryKeys.menus.all, 'list'] as const,
    list: (filters?: { search?: string; page?: number }) =>
      [...queryKeys.menus.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.menus.all, 'detail', id] as const,
  },

  cart: {
    all: ['cart'] as const,
  },

  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    active: () => [...queryKeys.orders.all, 'active'] as const,
    history: (page?: number, limit?: number) =>
      [...queryKeys.orders.all, 'history', { page, limit }] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
    tracking: (id: string) => [...queryKeys.orders.detail(id), 'tracking'] as const,
    statusHistory: (id: string) => [...queryKeys.orders.detail(id), 'status-history'] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters?: { page?: number; limit?: number; isRead?: boolean }) =>
      [...queryKeys.notifications.lists(), filters] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    count: () => [...queryKeys.notifications.all, 'count'] as const,
  },

  addresses: {
    all: ['addresses'] as const,
    detail: (id: string) => [...queryKeys.addresses.all, id] as const,
    default: () => [...queryKeys.addresses.all, 'default'] as const,
  },

  promotions: {
    all: ['promotions'] as const,
    detail: (id: string) => [...queryKeys.promotions.all, id] as const,
    active: () => [...queryKeys.promotions.all, 'active'] as const,
    validate: (code: string) => [...queryKeys.promotions.all, 'validate', code] as const,
  },

  reviews: {
    all: ['reviews'] as const,
    merchant: (merchantId: string, page?: number, limit?: number) =>
      [...queryKeys.reviews.all, 'merchant', merchantId, { page, limit }] as const,
    driver: (driverId: string, page?: number, limit?: number) =>
      [...queryKeys.reviews.all, 'driver', driverId, { page, limit }] as const,
  },

  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
};

export default queryKeys;
