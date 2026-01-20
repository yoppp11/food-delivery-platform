import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Merchant, Menu, MerchantReview, MerchantOperationalHour, MerchantMenuCategory } from '@/types';

interface MerchantListFilters {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
}

interface MerchantListResponse {
  data: Merchant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ReviewListResponse {
  data: MerchantReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function transformMenuData(categories: MerchantMenuCategory[]): Menu[] {
  const menus: Menu[] = [];
  for (const category of categories) {
    if (category.menus) {
      for (const menu of category.menus) {
        const variants = menu.menuVariants || menu.variants || [];
        const imageUrl = menu.image?.imageUrl || menu.imageUrl || null;
        menus.push({
          ...menu,
          variants,
          menuVariants: variants,
          imageUrl,
          category,
        });
      }
    }
  }
  return menus;
}

export function useMerchants(filters?: MerchantListFilters) {
  return useQuery({
    queryKey: queryKeys.merchants.list(filters),
    queryFn: () => apiClient.get<MerchantListResponse>('/merchants', filters as Record<string, string | number>),
  });
}

export function useMerchant(id: string) {
  return useQuery({
    queryKey: queryKeys.merchants.detail(id),
    queryFn: () => apiClient.get<Merchant>(`/merchants/${id}`),
    enabled: !!id,
  });
}

export function useFeaturedMerchants(limit?: number) {
  return useQuery({
    queryKey: queryKeys.merchants.featured(limit),
    queryFn: () => apiClient.get<Merchant[]>('/merchants/featured', limit ? { limit } : undefined),
  });
}

export function useNearbyMerchants(lat: number, lng: number, maxDistance?: number) {
  return useQuery({
    queryKey: queryKeys.merchants.nearby(lat, lng, maxDistance),
    queryFn: () =>
      apiClient.get<Merchant[]>('/merchants/nearby', {
        lat,
        lng,
        ...(maxDistance && { maxDistance }),
      }),
    enabled: !!lat && !!lng,
  });
}

export function useMerchantMenus(merchantId: string) {
  return useQuery({
    queryKey: queryKeys.merchants.menus(merchantId),
    queryFn: async () => {
      const categories = await apiClient.get<MerchantMenuCategory[]>(`/merchants/${merchantId}/menus`);
      return transformMenuData(categories);
    },
    enabled: !!merchantId,
  });
}

export function useMerchantReviews(merchantId: string, page?: number, limit?: number) {
  return useQuery({
    queryKey: queryKeys.merchants.reviews(merchantId, page),
    queryFn: () =>
      apiClient.get<ReviewListResponse>(`/merchants/${merchantId}/reviews`, {
        ...(page && { page }),
        ...(limit && { limit }),
      }),
    enabled: !!merchantId,
  });
}

export function useMerchantOperationalHours(merchantId: string) {
  return useQuery({
    queryKey: queryKeys.merchants.operationalHours(merchantId),
    queryFn: () => apiClient.get<MerchantOperationalHour[]>(`/merchants/${merchantId}/operational-hours`),
    enabled: !!merchantId,
  });
}

export default {
  useMerchants,
  useMerchant,
  useFeaturedMerchants,
  useNearbyMerchants,
  useMerchantMenus,
  useMerchantReviews,
  useMerchantOperationalHours,
};
