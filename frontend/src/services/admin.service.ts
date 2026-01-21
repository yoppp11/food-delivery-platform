import { apiClient } from '@/lib/api-client';
import type {
  DashboardStats,
  AdminQueryParams,
  AdminUserListResponse,
  AdminMerchantListResponse,
  AdminDriverListResponse,
  AdminOrderListResponse,
  AdminOrderQueryParams,
  UpdateUserStatus,
  UpdateUserRole,
  ReportParams,
  ReportResponse,
  CreatePromotion,
  UpdatePromotion,
} from '@/types/admin';
import type { User, Merchant, Promotion, Category, Driver } from '@/types';

export const adminService = {
  getDashboardStats: () =>
    apiClient.get<DashboardStats>('/admin/dashboard'),

  getUsers: (params: AdminQueryParams = {}) => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.search) queryParams.search = params.search;
    if (params.role) queryParams.role = params.role;
    if (params.status) queryParams.status = params.status;
    return apiClient.get<AdminUserListResponse>('/admin/users', queryParams);
  },

  getUserById: (id: string) =>
    apiClient.get<User>(`/admin/users/${id}`),

  updateUserStatus: (id: string, data: UpdateUserStatus) =>
    apiClient.patch<User>(`/admin/users/${id}/status`, data),

  updateUserRole: (id: string, data: UpdateUserRole) =>
    apiClient.patch<User>(`/admin/users/${id}/role`, data),

  getMerchants: (params: AdminQueryParams = {}) => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.search) queryParams.search = params.search;
    return apiClient.get<AdminMerchantListResponse>('/admin/merchants', queryParams);
  },

  getMerchantById: (id: string) =>
    apiClient.get<Merchant>(`/merchants/${id}`),

  verifyMerchant: (id: string) =>
    apiClient.patch<Merchant>(`/admin/merchants/${id}/verify`),

  suspendMerchant: (id: string) =>
    apiClient.patch<Merchant>(`/admin/merchants/${id}/suspend`),

  approveMerchant: (id: string) =>
    apiClient.patch<Merchant>(`/merchants/${id}/approve`),

  rejectMerchant: (id: string) =>
    apiClient.patch<Merchant>(`/merchants/${id}/reject`),

  getPendingMerchants: () =>
    apiClient.get<Merchant[]>('/merchants/admin/pending'),

  getDrivers: (params: AdminQueryParams = {}) => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.search) queryParams.search = params.search;
    return apiClient.get<AdminDriverListResponse>('/admin/drivers', queryParams);
  },

  getDriverById: (id: string) =>
    apiClient.get<Driver>(`/drivers/${id}`),

  approveDriver: (id: string) =>
    apiClient.patch<Driver>(`/drivers/${id}/approve`),

  rejectDriver: (id: string) =>
    apiClient.patch<Driver>(`/drivers/${id}/reject`),

  getPendingDrivers: () =>
    apiClient.get<Driver[]>('/drivers/pending'),

  getOrders: (params: AdminOrderQueryParams = {}) => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.orderStatus) queryParams.status = params.orderStatus;
    if (params.paymentStatus) queryParams.paymentStatus = params.paymentStatus;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.merchantId) queryParams.merchantId = params.merchantId;
    if (params.userId) queryParams.userId = params.userId;
    return apiClient.get<AdminOrderListResponse>('/admin/orders', queryParams);
  },

  getOrderById: (id: string) =>
    apiClient.get<AdminOrderListResponse['data'][0]>(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    apiClient.patch(`/orders/${id}/status`, { status }),

  processRefund: (id: string) =>
    apiClient.post(`/admin/orders/${id}/refund`),

  assignDriver: (orderId: string, driverId: string) =>
    apiClient.patch(`/admin/orders/${orderId}/assign-driver`, { driverId }),

  getReports: (params: ReportParams = {}) => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.period) queryParams.period = params.period;
    return apiClient.get<ReportResponse>('/admin/reports', queryParams);
  },

  createPromotion: (data: CreatePromotion) =>
    apiClient.post<Promotion>('/admin/promotions', data),

  updatePromotion: (id: string, data: UpdatePromotion) =>
    apiClient.patch<Promotion>(`/admin/promotions/${id}`, data),

  deletePromotion: (id: string) =>
    apiClient.delete<void>(`/admin/promotions/${id}`),

  getPromotions: (params: AdminQueryParams = {}) => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    return apiClient.get<{ data: Promotion[]; total: number; page: number; limit: number; totalPages: number }>('/admin/promotions', queryParams);
  },

  getCategories: (params: AdminQueryParams = {}) => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    return apiClient.get<Category[]>('/categories', queryParams);
  },

  createCategory: (data: { name: string; description?: string }) =>
    apiClient.post<Category>('/categories', data),

  updateCategory: (id: string, data: { name: string; description?: string }) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  deleteCategory: (id: string) =>
    apiClient.delete<void>(`/categories/${id}`),
};
