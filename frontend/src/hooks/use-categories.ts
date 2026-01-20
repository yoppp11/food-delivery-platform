import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Category } from '@/types';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => apiClient.get<Category[]>('/categories'),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => apiClient.get<Category>(`/categories/${id}`),
    enabled: !!id,
  });
}

export default {
  useCategories,
  useCategory,
};
