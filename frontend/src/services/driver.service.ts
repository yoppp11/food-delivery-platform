import { apiClient } from '@/lib/api-client';
import type {
  Driver,
  DriverLocation,
  DriverEarnings,
  EarningsHistoryResponse,
  RegisterDriverInput,
  UpdateDriverProfileInput,
  UpdateLocationInput,
  AvailableOrder,
  DeliveryHistoryResponse,
  Order,
} from '@/types';

export const driverService = {
  getMyProfile: () => apiClient.get<Driver>('/drivers/me'),

  updateProfile: (data: UpdateDriverProfileInput) =>
    apiClient.put<Driver>('/drivers/profile', data),

  toggleAvailability: (isAvailable: boolean) =>
    apiClient.patch<Driver>('/drivers/availability', { isAvailable }),

  updateLocation: (data: UpdateLocationInput) =>
    apiClient.patch<DriverLocation>('/drivers/updateLocation', data),

  getEarnings: () => apiClient.get<DriverEarnings>('/drivers/earnings'),

  getEarningsHistory: (page = 1, limit = 20) =>
    apiClient.get<EarningsHistoryResponse>('/drivers/earnings/history', { page, limit }),

  register: (data: RegisterDriverInput) => apiClient.post<Driver>('/drivers/register', data),
};

export const driverOrderService = {
  getAvailableOrders: () => apiClient.get<AvailableOrder[]>('/drivers/orders/available'),

  acceptOrder: (orderId: string) =>
    apiClient.post<Order>(`/drivers/orders/${orderId}/accept`),

  markPickedUp: (orderId: string) =>
    apiClient.patch<Order>(`/drivers/orders/${orderId}/pickup`),

  markDelivered: (orderId: string) =>
    apiClient.patch<Order>(`/drivers/orders/${orderId}/deliver`),
};

export const driverDeliveryService = {
  getActiveOrder: () => apiClient.get<Order | null>('/deliveries/drivers/active'),

  getDeliveryHistory: (page = 1, limit = 20) =>
    apiClient.get<DeliveryHistoryResponse>('/deliveries/drivers', { page, limit }),
};
