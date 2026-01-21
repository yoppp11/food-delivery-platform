import { apiClient } from '@/lib/api-client';
import type {
  MerchantOrder,
  MerchantOrderListResponse,
  MerchantOrderStatusHistory,
  OrderStatus,
} from '@/types/merchant';

export const merchantOrderService = {
  getOrders: (page?: number, limit?: number) => {
    const params: Record<string, number> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return apiClient.get<MerchantOrderListResponse>('/merchants/orders', params);
  },

  getPendingOrders: () => apiClient.get<MerchantOrder[]>('/merchants/orders/pending'),

  getOrderById: (id: string) => apiClient.get<MerchantOrder>(`/orders/${id}`),

  acceptOrder: (id: string) => apiClient.patch<MerchantOrder>(`/merchants/orders/${id}/accept`),

  rejectOrder: (id: string) => apiClient.patch<MerchantOrder>(`/merchants/orders/${id}/reject`),

  updateOrderStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<MerchantOrder>(`/orders/${id}`, { status }),

  getStatusHistory: (orderId: string) =>
    apiClient.get<MerchantOrderStatusHistory[]>(`/orders/${orderId}/status-history`),
};

export default merchantOrderService;
