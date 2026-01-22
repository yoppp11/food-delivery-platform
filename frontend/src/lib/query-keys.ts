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

  merchantDashboard: {
    all: ['merchant-dashboard'] as const,
    current: () => [...queryKeys.merchantDashboard.all, 'current'] as const,
    myMerchants: () => [...queryKeys.merchantDashboard.all, 'my-merchants'] as const,
    detail: (id: string) => [...queryKeys.merchantDashboard.all, id] as const,
    operationalHours: (id: string) =>
      [...queryKeys.merchantDashboard.detail(id), 'operational-hours'] as const,
    reviews: (id: string, page?: number) =>
      [...queryKeys.merchantDashboard.detail(id), 'reviews', { page }] as const,
  },

  merchantOrders: {
    all: ['merchant-orders'] as const,
    list: (page?: number) => [...queryKeys.merchantOrders.all, 'list', { page }] as const,
    pending: () => [...queryKeys.merchantOrders.all, 'pending'] as const,
    detail: (id: string) => [...queryKeys.merchantOrders.all, id] as const,
    statusHistory: (id: string) =>
      [...queryKeys.merchantOrders.detail(id), 'status-history'] as const,
  },

  merchantMenus: {
    all: ['merchant-menus'] as const,
    list: (filters?: { search?: string; page?: number }) =>
      [...queryKeys.merchantMenus.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.merchantMenus.all, id] as const,
  },

  merchantCategories: {
    all: ['merchant-categories'] as const,
    detail: (id: string) => [...queryKeys.merchantCategories.all, id] as const,
  },

  driver: {
    all: ['driver'] as const,
    profile: () => [...queryKeys.driver.all, 'profile'] as const,
    earnings: () => [...queryKeys.driver.all, 'earnings'] as const,
    earningsHistory: (page: number, limit: number) =>
      [...queryKeys.driver.all, 'earnings', 'history', { page, limit }] as const,
    availableOrders: () => [...queryKeys.driver.all, 'orders', 'available'] as const,
    activeOrder: () => [...queryKeys.driver.all, 'orders', 'active'] as const,
    deliveryHistory: (page: number, limit: number) =>
      [...queryKeys.driver.all, 'deliveries', { page, limit }] as const,
    reviews: (driverId: string, page: number, limit: number) =>
      [...queryKeys.driver.all, 'reviews', driverId, { page, limit }] as const,
  },

  admin: {
    all: ['admin'] as const,
    dashboard: () => [...queryKeys.admin.all, 'dashboard'] as const,
    users: (params?: Record<string, unknown>) =>
      [...queryKeys.admin.all, 'users', params] as const,
    user: (id: string) =>
      [...queryKeys.admin.all, 'users', id] as const,
    merchants: (params?: Record<string, unknown>) =>
      [...queryKeys.admin.all, 'merchants', params] as const,
    merchant: (id: string) =>
      [...queryKeys.admin.all, 'merchants', id] as const,
    drivers: (params?: Record<string, unknown>) =>
      [...queryKeys.admin.all, 'drivers', params] as const,
    driver: (id: string) =>
      [...queryKeys.admin.all, 'drivers', id] as const,
    orders: (params?: Record<string, unknown>) =>
      [...queryKeys.admin.all, 'orders', params] as const,
    order: (id: string) =>
      [...queryKeys.admin.all, 'orders', id] as const,
    reports: (params?: Record<string, unknown>) =>
      [...queryKeys.admin.all, 'reports', params] as const,
    promotions: (params?: Record<string, unknown>) =>
      [...queryKeys.admin.all, 'promotions', params] as const,
    categories: (params?: Record<string, unknown>) =>
      [...queryKeys.admin.all, 'categories', params] as const,
  },

  chat: {
    all: ['chat'] as const,
    rooms: () => [...queryKeys.chat.all, 'rooms'] as const,
    room: (id: string) => [...queryKeys.chat.all, 'room', id] as const,
    messages: (roomId: string) => [...queryKeys.chat.all, 'messages', roomId] as const,
    unreadCount: () => [...queryKeys.chat.all, 'unread'] as const,
    orderRoom: (orderId: string, type: string) => 
      [...queryKeys.chat.all, 'order', orderId, type] as const,
  },

  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.payments.all, 'detail', id] as const,
  },
};

export default queryKeys;
