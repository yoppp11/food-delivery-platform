import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { MerchantReview, DriverReview } from '@/types';

interface ReviewListResponse {
  data: MerchantReview[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateReviewInput {
  merchantId: string;
  rating: number;
  comment: string;
}

interface CreateDriverReviewInput {
  driverId: string;
  rating: number;
  comment?: string;
}

export interface OrderReviewStatus {
  orderId: string;
  merchantId: string;
  merchantName: string;
  driverId: string | null;
  driverName: string | null;
  driverPlateNumber: string | null;
  merchantReview: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
  } | null;
  driverReview: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
  } | null;
  canReviewMerchant: boolean;
  canReviewDriver: boolean;
}

export function useMerchantReviews(merchantId: string, page?: number, limit?: number) {
  return useQuery({
    queryKey: queryKeys.reviews.merchant(merchantId, page, limit),
    queryFn: () =>
      apiClient.get<ReviewListResponse>(`/reviews/merchants/${merchantId}`, {
        ...(page && { page }),
        ...(limit && { limit }),
      }),
    enabled: !!merchantId,
  });
}

export function useCreateMerchantReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, ...data }: CreateReviewInput) =>
      apiClient.post<MerchantReview>(`/reviews/merchants/${merchantId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.merchant(variables.merchantId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchants.detail(variables.merchantId),
      });
    },
  });
}

export function useCreateDriverReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ driverId, ...data }: CreateDriverReviewInput) =>
      apiClient.post<DriverReview>(`/reviews/drivers/${driverId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.driver(variables.driverId),
      });
    },
  });
}

export function useOrderReviewStatus(orderId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.orderStatus(orderId),
    queryFn: () =>
      apiClient.get<OrderReviewStatus>(`/reviews/orders/${orderId}/status`),
    enabled: !!orderId,
  });
}

export default {
  useMerchantReviews,
  useCreateMerchantReview,
  useCreateDriverReview,
  useOrderReviewStatus,
};
