import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { queryKeys } from '@/lib/query-keys';
import type {
  AdminQueryParams,
  AdminOrderQueryParams,
  UpdateUserStatus,
  UpdateUserRole,
  ReportParams,
  CreatePromotion,
  UpdatePromotion,
} from '@/types/admin';

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: adminService.getDashboardStats,
    refetchInterval: 30000,
  });
}

export function useAdminUsers(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => adminService.getUsers(params),
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.user(id),
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatus }) =>
      adminService.updateUserStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRole }) =>
      adminService.updateUserRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
  });
}

export function useAdminMerchants(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.merchants(params),
    queryFn: () => adminService.getMerchants(params),
  });
}

export function useAdminMerchant(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.merchant(id),
    queryFn: () => adminService.getMerchantById(id),
    enabled: !!id,
  });
}

export function useVerifyMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.verifyMerchant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.merchants() });
    },
  });
}

export function useSuspendMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.suspendMerchant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.merchants() });
    },
  });
}

export function useApproveMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.approveMerchant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.merchants() });
      queryClient.invalidateQueries({ queryKey: ['pendingMerchants'] });
    },
  });
}

export function useRejectMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.rejectMerchant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.merchants() });
      queryClient.invalidateQueries({ queryKey: ['pendingMerchants'] });
    },
  });
}

export function usePendingMerchants() {
  return useQuery({
    queryKey: ['pendingMerchants'],
    queryFn: adminService.getPendingMerchants,
  });
}

export function useAdminDrivers(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.drivers(params),
    queryFn: () => adminService.getDrivers(params),
  });
}

export function useAdminDriver(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.driver(id),
    queryFn: () => adminService.getDriverById(id),
    enabled: !!id,
  });
}

export function useApproveDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.approveDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.drivers() });
      queryClient.invalidateQueries({ queryKey: ['pendingDrivers'] });
    },
  });
}

export function useRejectDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.rejectDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.drivers() });
      queryClient.invalidateQueries({ queryKey: ['pendingDrivers'] });
    },
  });
}

export function usePendingDrivers() {
  return useQuery({
    queryKey: ['pendingDrivers'],
    queryFn: adminService.getPendingDrivers,
  });
}

export function useAdminOrders(params: AdminOrderQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.orders(params),
    queryFn: () => adminService.getOrders(params),
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.order(id),
    queryFn: () => adminService.getOrderById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders() });
    },
  });
}

export function useProcessRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.processRefund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders() });
    },
  });
}

export function useAssignDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, driverId }: { orderId: string; driverId: string }) =>
      adminService.assignDriver(orderId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders() });
    },
  });
}

export function useAdminReports(params: ReportParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.reports(params),
    queryFn: () => adminService.getReports(params),
  });
}

export function useAdminPromotions(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.promotions(params),
    queryFn: () => adminService.getPromotions(params),
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromotion) => adminService.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.promotions() });
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromotion }) =>
      adminService.updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.promotions() });
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.promotions() });
    },
  });
}

export function useAdminCategories(params: AdminQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.categories(params),
    queryFn: () => adminService.getCategories(params),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      adminService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description?: string } }) =>
      adminService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() });
    },
  });
}
