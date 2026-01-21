import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantOrderService } from '@/services/merchant-order.service';
import { queryKeys } from '@/lib/query-keys';
import type { OrderStatus } from '@/types/merchant';

export function useMerchantOrders(page?: number, limit?: number) {
  return useQuery({
    queryKey: queryKeys.merchantOrders.list(page),
    queryFn: () => merchantOrderService.getOrders(page, limit),
    retry: 2,
    staleTime: 0, // Always consider data stale so refetch works
    refetchOnMount: 'always',
  });
}

export function usePendingOrders() {
  return useQuery({
    queryKey: queryKeys.merchantOrders.pending(),
    queryFn: () => merchantOrderService.getPendingOrders(),
    refetchInterval: 30000,
    retry: 2,
    staleTime: 0, // Always consider data stale so refetch works
    refetchOnMount: 'always',
  });
}

export function useMerchantOrderDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.merchantOrders.detail(id),
    queryFn: () => merchantOrderService.getOrderById(id),
    enabled: !!id,
  });
}

export function useMerchantOrderStatusHistory(id: string) {
  return useQuery({
    queryKey: queryKeys.merchantOrders.statusHistory(id),
    queryFn: () => merchantOrderService.getStatusHistory(id),
    enabled: !!id,
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => merchantOrderService.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantOrders.all });
    },
  });
}

export function useRejectOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => merchantOrderService.rejectOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantOrders.all });
    },
  });
}

export function useUpdateMerchantOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      merchantOrderService.updateOrderStatus(id, status),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(queryKeys.merchantOrders.detail(updatedOrder.id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantOrders.all });
    },
  });
}

export default {
  useMerchantOrders,
  usePendingOrders,
  useMerchantOrderDetail,
  useMerchantOrderStatusHistory,
  useAcceptOrder,
  useRejectOrder,
  useUpdateMerchantOrderStatus,
};
