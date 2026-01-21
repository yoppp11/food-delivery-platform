import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { queryKeys } from '@/lib/query-keys';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/merchant';

export function useMerchantCategories() {
  return useQuery({
    queryKey: queryKeys.merchantCategories.all,
    queryFn: () => categoryService.getCategories(),
  });
}

export function useMerchantCategoryDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.merchantCategories.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantCategories.all });
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantCategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantCategories.detail(id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantCategories.all });
    },
  });
}

export default {
  useMerchantCategories,
  useMerchantCategoryDetail,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
};
