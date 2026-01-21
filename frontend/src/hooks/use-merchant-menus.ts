import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menu.service';
import { queryKeys } from '@/lib/query-keys';
import type { UpdateMenuRequest } from '@/types/merchant';

export function useMerchantMenus(search?: string, page?: number) {
  return useQuery({
    queryKey: queryKeys.merchantMenus.list({ search, page }),
    queryFn: () => menuService.getMenus(search, page),
  });
}

export function useMerchantMenuDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.merchantMenus.detail(id),
    queryFn: () => menuService.getMenuById(id),
    enabled: !!id,
  });
}

export function useCreateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => menuService.createMenu(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantMenus.all });
    },
  });
}

export function useUpdateMenu(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMenuRequest) => menuService.updateMenu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantMenus.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantMenus.detail(id) });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuService.deleteMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantMenus.all });
    },
  });
}

export default {
  useMerchantMenus,
  useMerchantMenuDetail,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
};
