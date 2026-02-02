import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { Merchant, Menu, MenuVariant } from '@/types';
import {
  useActiveCart,
  useCreateCart,
  useUpdateCartItem,
  useDeleteCart,
} from '@/hooks/use-cart';

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

interface TransformedCartItem {
  id: string;
  menu: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    image?: { id: string; imageUrl: string };
  };
  variant?: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  notes?: string;
}

interface TransformedCart {
  id: string;
  merchantId: string;
  merchant: {
    id: string;
    name: string;
    description?: string;
    isOpen: boolean;
    rating?: number;
  };
  items: TransformedCartItem[];
  subtotal: number;
  notes?: string;
}

interface CartContextType {
  cart: TransformedCart | null;
  isLoading: boolean;
  addItem: (merchant: Merchant, menu: Menu, variant?: MenuVariant, quantity?: number) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function transformBackendCart(backendCart: BackendCart | null): TransformedCart | null {
  if (!backendCart) return null;

  return {
    id: backendCart.id,
    merchantId: backendCart.merchantId,
    merchant: backendCart.merchant || {
      id: backendCart.merchantId,
      name: 'Unknown Merchant',
      isOpen: true,
    },
    items: backendCart.cartItems.map((item) => ({
      id: item.id,
      menu: {
        id: item.menuVariant?.menu?.id || item.variantId,
        name: item.menuName,
        description: item.menuVariant?.menu?.description || '',
        price: item.basePrice,
        imageUrl: item.menuVariant?.menu?.image?.imageUrl,
        image: item.menuVariant?.menu?.image,
      },
      variant: item.menuVariant
        ? {
            id: item.menuVariant.id,
            name: item.menuVariant.name,
            price: item.menuVariant.price,
          }
        : undefined,
      quantity: item.quantity,
      notes: item.notes,
    })),
    subtotal: backendCart.subtotal,
    notes: backendCart.notes,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: backendCart, isLoading } = useActiveCart();
  const createCartMutation = useCreateCart();
  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartMutation = useDeleteCart();

  const cart = useMemo(
    () => transformBackendCart(backendCart ?? null),
    [backendCart]
  );

  const addItem = (
    merchant: Merchant,
    menu: Menu,
    variant?: MenuVariant,
    quantity = 1
  ) => {
    const variantToUse = variant || (menu.menuVariants?.[0]) || (menu.variants?.[0]);
    
    if (!variantToUse) {
      toast.error('This menu item is not available for ordering');
      return;
    }

    createCartMutation.mutate(
      {
        merchantId: merchant.id,
        menuName: menu.name,
        variantId: variantToUse.id,
        basePrice: variantToUse.price,
        quantity,
        itemTotal: variantToUse.price * quantity,
      },
      {
        onSuccess: () => {
          toast.success(`${menu.name} added to cart`);
        },
        onError: () => {
          toast.error('Failed to add item to cart');
        },
      }
    );
  };

  const updateItem = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    const currentItem = cart?.items.find((item) => item.id === itemId);
    if (!currentItem) return;

    const type = quantity > currentItem.quantity ? 'INCREMENT' : 'DECREMENT';
    
    updateCartItemMutation.mutate(
      { cartItemId: itemId, type, quantity },
      {
        onError: () => {
          toast.error('Failed to update cart');
        },
      }
    );
  };

  const removeItem = (itemId: string) => {
    deleteCartMutation.mutate(
      { id: itemId, type: 'item' },
      {
        onSuccess: () => {
          toast.success('Item removed from cart');
        },
        onError: () => {
          toast.error('Failed to remove item');
        },
      }
    );
  };

  const clearCart = () => {
    if (!cart?.id) return;
    
    deleteCartMutation.mutate(
      { id: cart.id, type: 'cart' },
      {
        onSuccess: () => {
          toast.success('Cart cleared');
        },
        onError: () => {
          toast.error('Failed to clear cart');
        },
      }
    );
  };

  const getItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart?.subtotal ?? 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        getItemCount,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
