import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Promotion } from '@/types';

interface ValidatePromoResult {
  valid: boolean;
  promotion?: Promotion;
  message?: string;
}

interface ApplyPromoInput {
  code: string;
  orderId: string;
}

interface ApplyPromoResult {
  success: boolean;
  discountAmount: number;
  message?: string;
}

export function usePromotions() {
  return useQuery({
    queryKey: queryKeys.promotions.all,
    queryFn: () => apiClient.get<Promotion[]>('/promotions'),
  });
}

export function useActivePromotions() {
  return useQuery({
    queryKey: queryKeys.promotions.active(),
    queryFn: () => apiClient.get<Promotion[]>('/promotions/active'),
  });
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: queryKeys.promotions.detail(id),
    queryFn: () => apiClient.get<Promotion>(`/promotions/${id}`),
    enabled: !!id,
  });
}

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: (code: string) =>
      apiClient.post<ValidatePromoResult>('/promotions/validate', { code }),
  });
}

export function useApplyPromotion() {
  return useMutation({
    mutationFn: (data: ApplyPromoInput) =>
      apiClient.post<ApplyPromoResult>('/promotions/apply', data),
  });
}

export default {
  usePromotions,
  useActivePromotions,
  usePromotion,
  useValidatePromoCode,
  useApplyPromotion,
};
