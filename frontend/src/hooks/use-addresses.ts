import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { UserAddress } from '@/types';

interface CreateAddressInput {
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: string;
}

export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses.all,
    queryFn: () => apiClient.get<UserAddress[]>('/users/addresses'),
  });
}

export function useAddress(id: string) {
  return useQuery({
    queryKey: queryKeys.addresses.detail(id),
    queryFn: () => apiClient.get<UserAddress>(`/users/addresses/${id}`),
    enabled: !!id,
  });
}

export function useDefaultAddress() {
  const { data: addresses, ...rest } = useAddresses();
  const defaultAddress = addresses?.find((addr) => addr.isDefault) ?? addresses?.[0] ?? null;
  return {
    data: defaultAddress,
    ...rest,
  };
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressInput) =>
      apiClient.post<UserAddress>('/users/addresses', data),
    onSuccess: (newAddress) => {
      queryClient.setQueryData<UserAddress[]>(queryKeys.addresses.all, (old) => {
        if (!old) return [newAddress];
        return [...old, newAddress];
      });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateAddressInput) =>
      apiClient.put<UserAddress>(`/users/addresses/${id}`, data),
    onSuccess: (updatedAddress) => {
      queryClient.setQueryData<UserAddress[]>(queryKeys.addresses.all, (old) => {
        if (!old) return old;
        return old.map((addr) =>
          addr.id === updatedAddress.id ? updatedAddress : addr
        );
      });
      queryClient.setQueryData(
        queryKeys.addresses.detail(updatedAddress.id),
        updatedAddress
      );
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/users/addresses/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.addresses.all });
      const previousAddresses = queryClient.getQueryData<UserAddress[]>(
        queryKeys.addresses.all
      );

      queryClient.setQueryData<UserAddress[]>(queryKeys.addresses.all, (old) => {
        if (!old) return old;
        return old.filter((addr) => addr.id !== id);
      });

      return { previousAddresses };
    },
    onError: (_, __, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(queryKeys.addresses.all, context.previousAddresses);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<UserAddress>(`/users/addresses/${id}/default`),
    onSuccess: (updatedAddress) => {
      queryClient.setQueryData<UserAddress[]>(queryKeys.addresses.all, (old) => {
        if (!old) return old;
        return old.map((addr) => ({
          ...addr,
          isDefault: addr.id === updatedAddress.id,
        }));
      });
    },
  });
}

export default {
  useAddresses,
  useAddress,
  useDefaultAddress,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
};
