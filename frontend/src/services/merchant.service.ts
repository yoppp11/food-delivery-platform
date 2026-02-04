import { apiClient } from "@/lib/api-client";
import type {
  Merchant,
  MerchantOperationalHour,
  UpdateMerchantRequest,
  CreateOperationalHourRequest,
  UpdateOperationalHourRequest,
  ReviewListResponse,
} from "@/types/merchant";

export interface RegisterMerchantInput {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export const merchantService = {
  getMerchant: (id: string) => apiClient.get<Merchant>(`/merchants/${id}`),

  getCurrentMerchant: () => apiClient.get<Merchant>("/merchants/me"),

  getMyMerchants: () => apiClient.get<Merchant[]>("/merchants/my-merchants"),

  updateMerchant: (id: string, data: UpdateMerchantRequest) =>
    apiClient.put<Merchant>(`/merchants/${id}`, data),

  toggleStatus: (id: string) =>
    apiClient.patch<Merchant>(`/merchants/${id}/toggle-status`),

  register: (data: RegisterMerchantInput) =>
    apiClient.post<Merchant>("/merchants/register", data),

  getOperationalHours: (merchantId: string) =>
    apiClient.get<MerchantOperationalHour[]>(
      `/merchants/${merchantId}/operational-hours`,
    ),

  createOperationalHour: (
    merchantId: string,
    data: CreateOperationalHourRequest,
  ) =>
    apiClient.post<MerchantOperationalHour>(
      `/merchants/${merchantId}/operational-hours`,
      data,
    ),

  updateOperationalHour: (
    merchantId: string,
    hourId: string,
    data: UpdateOperationalHourRequest,
  ) =>
    apiClient.put<MerchantOperationalHour>(
      `/merchants/${merchantId}/operational-hours/${hourId}`,
      data,
    ),

  deleteOperationalHour: (merchantId: string, hourId: string) =>
    apiClient.delete<MerchantOperationalHour>(
      `/merchants/${merchantId}/operational-hours/${hourId}`,
    ),

  getReviews: (merchantId: string, page?: number, limit?: number) => {
    const params: Record<string, number> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return apiClient.get<ReviewListResponse>(
      `/merchants/${merchantId}/reviews`,
      params,
    );
  },
};

export default merchantService;
