import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  merchantService,
  type RegisterMerchantInput,
} from "@/services/merchant.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  UpdateMerchantRequest,
  CreateOperationalHourRequest,
  UpdateOperationalHourRequest,
} from "@/types/merchant";

export function useCurrentMerchant() {
  return useQuery({
    queryKey: queryKeys.merchantDashboard.current(),
    queryFn: () => merchantService.getCurrentMerchant(),
  });
}

export function useMerchantProfile(id: string) {
  return useQuery({
    queryKey: queryKeys.merchantDashboard.detail(id),
    queryFn: () => merchantService.getMerchant(id),
    enabled: !!id,
  });
}

export function useUpdateMerchant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMerchantRequest) =>
      merchantService.updateMerchant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchantDashboard.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchantDashboard.myMerchants(),
      });
    },
  });
}

export function useToggleMerchantStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => merchantService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchantDashboard.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchantDashboard.myMerchants(),
      });
    },
  });
}

export function useMerchantOperationalHours(merchantId: string) {
  return useQuery({
    queryKey: queryKeys.merchantDashboard.operationalHours(merchantId),
    queryFn: () => merchantService.getOperationalHours(merchantId),
    enabled: !!merchantId,
  });
}

export function useCreateOperationalHour(merchantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOperationalHourRequest) =>
      merchantService.createOperationalHour(merchantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchantDashboard.operationalHours(merchantId),
      });
    },
  });
}

export function useUpdateOperationalHour(merchantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hourId,
      data,
    }: {
      hourId: string;
      data: UpdateOperationalHourRequest;
    }) => merchantService.updateOperationalHour(merchantId, hourId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchantDashboard.operationalHours(merchantId),
      });
    },
  });
}

export function useDeleteOperationalHour(merchantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hourId: string) =>
      merchantService.deleteOperationalHour(merchantId, hourId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.merchantDashboard.operationalHours(merchantId),
      });
    },
  });
}

export function useMerchantReviews(
  merchantId: string,
  page?: number,
  limit?: number,
) {
  return useQuery({
    queryKey: queryKeys.merchantDashboard.reviews(merchantId, page),
    queryFn: () => merchantService.getReviews(merchantId, page, limit),
    enabled: !!merchantId,
  });
}

export function useRegisterMerchant() {
  return useMutation({
    mutationFn: (data: RegisterMerchantInput) => merchantService.register(data),
  });
}

export default {
  useCurrentMerchant,
  useMerchantProfile,
  useUpdateMerchant,
  useToggleMerchantStatus,
  useMerchantOperationalHours,
  useCreateOperationalHour,
  useUpdateOperationalHour,
  useDeleteOperationalHour,
  useMerchantReviews,
  useRegisterMerchant,
};
