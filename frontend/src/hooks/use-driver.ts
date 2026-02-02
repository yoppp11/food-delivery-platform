import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService, driverOrderService, driverDeliveryService } from '@/services/driver.service';
import { queryKeys } from '@/lib/query-keys';
import type { UpdateLocationInput, RegisterDriverInput, UpdateDriverProfileInput } from '@/types';

export function useDriverProfile() {
  return useQuery({
    queryKey: queryKeys.driver.profile(),
    queryFn: driverService.getMyProfile,
    retry: false,
  });
}

export function useUpdateDriverProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDriverProfileInput) => driverService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.profile() });
    },
  });
}

export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isAvailable: boolean) => driverService.toggleAvailability(isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.profile() });
    },
  });
}

export function useUpdateLocation() {
  return useMutation({
    mutationFn: (data: UpdateLocationInput) => driverService.updateLocation(data),
  });
}

export function useDriverEarnings() {
  return useQuery({
    queryKey: queryKeys.driver.earnings(),
    queryFn: driverService.getEarnings,
  });
}

export function useEarningsHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.driver.earningsHistory(page, limit),
    queryFn: () => driverService.getEarningsHistory(page, limit),
  });
}

export function useAvailableOrders() {
  return useQuery({
    queryKey: queryKeys.driver.availableOrders(),
    queryFn: driverOrderService.getAvailableOrders,
    refetchInterval: 30000,
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => driverOrderService.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.availableOrders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.activeOrder() });
    },
  });
}

export function useMarkPickedUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => driverOrderService.markPickedUp(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.activeOrder() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useMarkDelivered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => driverOrderService.markDelivered(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.earnings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.deliveryHistory(1, 20) });
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.activeOrder() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useDriverActiveOrder() {
  return useQuery({
    queryKey: queryKeys.driver.activeOrder(),
    queryFn: driverDeliveryService.getActiveOrder,
    refetchInterval: 10000
  });
}

export function useDeliveryHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.driver.deliveryHistory(page, limit),
    queryFn: () => driverDeliveryService.getDeliveryHistory(page, limit),
  });
}

export function useRegisterDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDriverInput) => driverService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
  });
}
