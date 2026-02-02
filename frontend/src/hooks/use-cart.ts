import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { useSession } from './use-auth';

interface BackendCartItem {
  id: string;
  cartId: string;
  menuName: string;
  variantId: string;
  basePrice: number;
  quantity: number;
  itemTotal: number;
  notes?: string;
  menuVariant?: {
    id: string;
    name: string;
    price: number;
    menu?: {
      id: string;
      name: string;
      description: string;
      price: number;
      imageId?: string;
      image?: {
        id: string;
        imageUrl: string;
      };
    };
  };
}

interface BackendCart {
  id: string;
  merchantId: string;
  userId: string;
  orderId?: string;
  status: 'ACTIVE' | 'ORDERED' | 'EXPIRED';
  subtotal: number;
  notes?: string;
  merchant?: {
    id: string;
    name: string;
    description?: string;
    isOpen: boolean;
    rating?: number;
  };
  cartItems: BackendCartItem[];
}

interface CreateCartItemInput {
  menuName: string;
  variantId: string;
  basePrice: number;
  quantity: number;
  notes?: string;
}

interface CreateCartInput {
  merchantId: string;
  menuName: string;
  variantId: string;
  basePrice: number;
  quantity: number;
  itemTotal: number;
  notes?: string;
}

type EditType = 'INCREMENT' | 'DECREMENT' | 'set';
type DeleteType = 'item' | 'cart';

export function useCarts() {
  const { data: session } = useSession();
  const isCustomer = session?.user?.role === 'CUSTOMER';

  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: () => apiClient.get<BackendCart[]>('/carts'),
    enabled: isCustomer,
  });
}

export function useActiveCart() {
  const { data: carts, ...rest } = useCarts();
  const activeCart = carts?.find((cart) => cart.status === 'ACTIVE') ?? null;
  return {
    data: activeCart,
    ...rest,
  };
}

export function useCreateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCartInput) => {
      const payload = {
        merchantId: data.merchantId,
        items: [
          {
            menuName: data.menuName,
            variantId: data.variantId,
            basePrice: data.basePrice,
            quantity: data.quantity,
            notes: data.notes,
          },
        ],
      };
      return apiClient.post<BackendCart>('/carts', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartItemId,
      type,
      quantity,
    }: {
      cartItemId: string;
      type: EditType;
      quantity?: number;
    }) =>
      apiClient.patch<BackendCartItem>(`/carts/${cartItemId}?type=${type}`, { quantity }),
    onMutate: async ({ cartItemId, type, quantity }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });

      const previousCarts = queryClient.getQueryData<BackendCart[]>(queryKeys.cart.all);

      queryClient.setQueryData<BackendCart[]>(queryKeys.cart.all, (old) => {
        if (!old) return old;
        return old.map((cart) => ({
          ...cart,
          cartItems: cart.cartItems.map((item) => {
            if (item.id !== cartItemId) return item;
            let newQuantity = item.quantity;
            if (type === 'INCREMENT') newQuantity += 1;
            else if (type === 'DECREMENT') newQuantity -= 1;
            else if (type === 'set' && quantity !== undefined) newQuantity = quantity;
            return {
              ...item,
              quantity: Math.max(0, newQuantity),
              itemTotal: item.basePrice * Math.max(0, newQuantity),
            };
          }),
        }));
      });

      return { previousCarts };
    },
    onError: (_, __, context) => {
      if (context?.previousCarts) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCarts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useDeleteCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: DeleteType }) =>
      apiClient.delete<void>(`/carts/${id}?type=${type}`),
    onMutate: async ({ id, type }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const previousCarts = queryClient.getQueryData<BackendCart[]>(queryKeys.cart.all);

      queryClient.setQueryData<BackendCart[]>(queryKeys.cart.all, (old) => {
        if (!old) return old;
        if (type === 'cart') {
          return old.filter((cart) => cart.id !== id);
        }
        return old.map((cart) => ({
          ...cart,
          cartItems: cart.cartItems.filter((item) => item.id !== id),
        }));
      });

      return { previousCarts };
    },
    onError: (_, __, context) => {
      if (context?.previousCarts) {
        queryClient.setQueryData(queryKeys.cart.all, context.previousCarts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useClearCart() {
  return useDeleteCart();
}

export function useCartItemCount() {
  const { data: cart } = useActiveCart();
  return cart?.cartItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function useCartSubtotal() {
  const { data: cart } = useActiveCart();
  return cart?.subtotal ?? 0;
}

export default {
  useCarts,
  useActiveCart,
  useCreateCart,
  useUpdateCartItem,
  useDeleteCart,
  useClearCart,
  useCartItemCount,
  useCartSubtotal,
};
