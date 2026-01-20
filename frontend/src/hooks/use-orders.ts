import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Order, OrderStatusHistory } from '@/types';

interface CreateOrderInput {
  merchantId: string;
  items: {
    variantId: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  deliveryFee?: number;
}

interface OrderListResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type OrderStatus = 'CREATED' | 'PAID' | 'PREPARING' | 'READY' | 'ON_DELIVERY' | 'COMPLETED' | 'CANCELLED';

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.lists(),
    queryFn: () => apiClient.get<Order[]>('/orders'),
  });
}

export function useActiveOrders() {
  return useQuery({
    queryKey: queryKeys.orders.active(),
    queryFn: () => apiClient.get<Order[]>('/orders/active'),
    refetchInterval: 30000,
  });
}

export function useOrderHistory(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.orders.history(page, limit),
    queryFn: () =>
      apiClient.get<OrderListResponse>('/orders/history', { page, limit }),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => apiClient.get<Order>(`/orders/${id}`),
    enabled: !!id,
  });
}

export function useOrderTracking(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.tracking(id),
    queryFn: () => apiClient.get<Order>(`/orders/${id}/track`),
    enabled: !!id,
    refetchInterval: 10000,
  });
}

export function useOrderStatusHistory(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.statusHistory(id),
    queryFn: () => apiClient.get<OrderStatusHistory[]>(`/orders/${id}/status-history`),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => apiClient.post<Order>('/orders', data),
    onSuccess: (newOrder) => {
      queryClient.setQueryData<Order[]>(queryKeys.orders.active(), (old) => {
        if (!old) return [newOrder];
        return [newOrder, ...old];
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      apiClient.patch<Order>(`/orders/${id}`, { status }),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(queryKeys.orders.detail(updatedOrder.id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.patch<Order>(`/orders/${id}/cancelled`),
    onSuccess: (cancelledOrder) => {
      queryClient.setQueryData(queryKeys.orders.detail(cancelledOrder.id), cancelledOrder);
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}

export function useReorder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => apiClient.post<Order>(`/orders/${orderId}/reorder`),
    onSuccess: (newOrder) => {
      queryClient.setQueryData<Order[]>(queryKeys.orders.active(), (old) => {
        if (!old) return [newOrder];
        return [newOrder, ...old];
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}

export default {
  useOrders,
  useActiveOrders,
  useOrderHistory,
  useOrder,
  useOrderTracking,
  useOrderStatusHistory,
  useCreateOrder,
  useUpdateOrderStatus,
  useCancelOrder,
  useReorder,
};
