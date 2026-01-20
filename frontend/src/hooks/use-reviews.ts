import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { MerchantReview } from '@/types';

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

export default {
  useMerchantReviews,
  useCreateMerchantReview,
};
