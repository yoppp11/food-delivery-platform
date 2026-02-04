import type { User, Merchant, Order, Driver, OrderStatus, PaymentStatus, Role, UserStatus } from './index';
import type { ApprovalStatus } from './driver';

export interface DashboardStats {
  totalUsers: number;
  totalMerchants: number;
  totalDrivers: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
}

export interface AdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: UserStatus;
  [key: string]: unknown;
}

export interface AdminOrderQueryParams extends AdminQueryParams {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  merchantId?: string;
  userId?: string;
}

export interface AdminListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AdminUserListResponse = AdminListResponse<User>;

export interface MerchantWithDetails extends Merchant {
  reviewCount: number;
  approvalStatus?: ApprovalStatus;
  user: {
    id: string;
    email: string;
    status: UserStatus;
  };
}

export type AdminMerchantListResponse = AdminListResponse<MerchantWithDetails>;

export interface DriverWithDetails extends Driver {
  totalDeliveries?: number;
  rating?: number;
  approvalStatus?: ApprovalStatus;
  user: User;
}

export type AdminDriverListResponse = AdminListResponse<DriverWithDetails>;

export interface OrderWithDetails extends Omit<Order, 'user' | 'merchant' | 'driver'> {
  user: {
    id: string;
    email: string;
    image?: string;
  };
  merchant: {
    id: string;
    name: string;
  };
  driver?: {
    id: string;
    plateNumber: string;
  };
}

export type AdminOrderListResponse = AdminListResponse<OrderWithDetails>;

export interface UpdateUserStatus {
  status: UserStatus;
  reason?: string;
}

export interface UpdateUserRole {
  role: Role;
}

export interface ReportParams {
  startDate?: string;
  endDate?: string;
  period?: '7d' | '30d' | '90d' | '1y';
  [key: string]: unknown;
}

export interface TopMerchant {
  id: string;
  name: string;
  orders: number;
  revenue: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersByStatus {
  status: OrderStatus;
  count: number;
  percentage: number;
}

export interface ReportResponse {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topMerchants: TopMerchant[];
  revenueByDay?: RevenueByDay[];
  ordersByStatus?: OrdersByStatus[];
}

export interface CreatePromotion {
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  discountValue: number;
  maxDiscount: number;
  expiredAt: string;
}

export interface UpdatePromotion extends Partial<CreatePromotion> {}
