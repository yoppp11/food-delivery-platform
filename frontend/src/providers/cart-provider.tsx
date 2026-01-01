import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Cart, CartItem, Merchant, Menu, MenuVariant } from '@/types';
import { generateId } from '@/lib/utils';

interface CartState {
  cart: Cart | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { merchant: Merchant; menu: Menu; variant?: MenuVariant; quantity: number } }
  | { type: 'UPDATE_ITEM'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addItem: (merchant: Merchant, menu: Menu, variant?: MenuVariant, quantity?: number) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { merchant, menu, variant, quantity } = action.payload;
      
      // If cart is empty or from a different merchant, start fresh
      if (!state.cart || state.cart.merchantId !== merchant.id) {
        const newItem: CartItem = {
          id: generateId(),
          menu,
          variant,
          quantity,
        };
        return {
          cart: {
            merchantId: merchant.id,
            merchant,
            items: [newItem],
          },
        };
      }

      // Check if item already exists
      const existingItemIndex = state.cart.items.findIndex(
        (item) =>
          item.menu.id === menu.id &&
          (item.variant?.id || null) === (variant?.id || null)
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.cart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return {
          cart: {
            ...state.cart,
            items: updatedItems,
          },
        };
      }

      const newItem: CartItem = {
        id: generateId(),
        menu,
        variant,
        quantity,
      };

      return {
        cart: {
          ...state.cart,
          items: [...state.cart.items, newItem],
        },
      };
    }

    case 'UPDATE_ITEM': {
      if (!state.cart) return state;

      const updatedItems = state.cart.items.map((item) =>
        item.id === action.payload.itemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      return {
        cart: {
          ...state.cart,
          items: updatedItems.filter((item) => item.quantity > 0),
        },
      };
    }

    case 'REMOVE_ITEM': {
      if (!state.cart) return state;

      const filteredItems = state.cart.items.filter(
        (item) => item.id !== action.payload.itemId
      );

      if (filteredItems.length === 0) {
        return { cart: null };
      }

      return {
        cart: {
          ...state.cart,
          items: filteredItems,
        },
      };
    }

    case 'CLEAR_CART':
      return { cart: null };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cart: null });

  const addItem = (
    merchant: Merchant,
    menu: Menu,
    variant?: MenuVariant,
    quantity = 1
  ) => {
    dispatch({ type: 'ADD_ITEM', payload: { merchant, menu, variant, quantity } });
  };

  const updateItem = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { itemId, quantity } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    if (!state.cart) return 0;
    return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    if (!state.cart) return 0;
    return state.cart.items.reduce((sum, item) => {
      const itemPrice = item.menu.price + (item.variant?.price || 0);
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
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
