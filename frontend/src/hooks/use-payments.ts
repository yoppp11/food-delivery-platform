import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Payment } from '@/types';

interface CreatePaymentInput {
  paymentMethod: 'qris' | 'paypal' | 'cimb_niaga_va' | 'bni_va' | 'sampoerna_va' | 'bnc_va' | 'maybank_va' | 'permata_va' | 'atm_bersama_va' | 'artha_graha_va' | 'bri_va';
}

interface CreatePaymentResponse extends Payment {
  paymentUrl: string;
}

export function usePayments() {
  return useQuery({
    queryKey: queryKeys.payments.lists(),
    queryFn: () => apiClient.get<Payment[]>('/payments'),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => apiClient.get<Payment>(`/payments/${id}`),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, paymentMethod }: { orderId: string; paymentMethod: CreatePaymentInput['paymentMethod'] }) =>
      apiClient.post<CreatePaymentResponse>(`/payments/${orderId}`, { paymentMethod }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() });
    },
  });
}

export function usePaymentSuccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post<Payment>(`/payments/${id}/success`),
    onSuccess: (payment) => {
      queryClient.setQueryData(queryKeys.payments.detail(payment.id), payment);
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() });
    },
  });
}

export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post<Payment>(`/payments/${id}/cancelled`),
    onSuccess: (payment) => {
      queryClient.setQueryData(queryKeys.payments.detail(payment.id), payment);
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() });
    },
  });
}

export default {
  usePayments,
  usePayment,
  useCreatePayment,
  usePaymentSuccess,
  useCancelPayment,
};
