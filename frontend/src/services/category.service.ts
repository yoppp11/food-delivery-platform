import { apiClient } from '@/lib/api-client';
import type {
  MerchantMenuCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/merchant';

export const categoryService = {
  getCategories: () => apiClient.get<MerchantMenuCategory[]>('/merchant-categories'),

  getCategoryById: (id: string) => apiClient.get<MerchantMenuCategory>(`/merchant-categories/${id}`),

  createCategory: (data: CreateCategoryRequest) =>
    apiClient.post<MerchantMenuCategory>('/merchant-categories', data),

  updateCategory: (id: string, data: UpdateCategoryRequest) =>
    apiClient.put<MerchantMenuCategory>(`/merchant-categories/${id}`, data),

  deleteCategory: (id: string) =>
    apiClient.delete<MerchantMenuCategory>(`/merchant-categories/${id}`),
};

export default categoryService;
