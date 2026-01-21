import { apiClient } from '@/lib/api-client';
import type {
  Menu,
  MenuApiResponse,
  UpdateMenuRequest,
  DeleteMenuResponse,
} from '@/types/merchant';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const menuService = {
  getMenus: (search?: string, page?: number) => {
    const params: Record<string, string | number> = {};
    if (search) params.search = search;
    if (page) params.page = page;
    return apiClient.get<MenuApiResponse>('/menus', params);
  },

  getMenuById: (id: string) => apiClient.get<Menu>(`/menus/${id}`),

  createMenu: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw error;
    }
    return response.json() as Promise<Menu>;
  },

  updateMenu: (id: string, data: UpdateMenuRequest) => apiClient.put<Menu>(`/menus/${id}`, data),

  deleteMenu: (id: string) => apiClient.delete<DeleteMenuResponse>(`/menus/${id}`),
};

export default menuService;
