import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createWrapper, createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useOrders,
  useActiveOrders,
  useOrder,
  useCreateOrder,
  useCancelOrder,
} from './use-orders';
import type { Order } from '@/types';

const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    merchantId: 'merchant-1',
    driverId: 'driver-1',
    status: 'PREPARING',
    totalPrice: 50000,
    deliveryFee: 10000,
    paymentStatus: 'SUCCESS',
  },
  {
    id: 'order-2',
    userId: 'user-1',
    merchantId: 'merchant-2',
    driverId: 'driver-2',
    status: 'COMPLETED',
    totalPrice: 75000,
    deliveryFee: 15000,
    paymentStatus: 'SUCCESS',
  },
];

describe('Order Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useOrders', () => {
    it('should fetch all orders', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockOrders)),
      });

      const { result } = renderHook(() => useOrders(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockOrders);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders'),
        expect.any(Object)
      );
    });
  });

  describe('useActiveOrders', () => {
    it('should fetch active orders', async () => {
      const activeOrders = mockOrders.filter((o) => o.status !== 'COMPLETED');

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(activeOrders)),
      });

      const { result } = renderHook(() => useActiveOrders(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(activeOrders);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/active'),
        expect.any(Object)
      );
    });
  });

  describe('useOrder', () => {
    it('should fetch a single order', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockOrders[0])),
      });

      const { result } = renderHook(() => useOrder('order-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockOrders[0]);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/order-1'),
        expect.any(Object)
      );
    });

    it('should not fetch when ID is empty', async () => {
      global.fetch = vi.fn();

      const { result } = renderHook(() => useOrder(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('useCreateOrder', () => {
    it('should create a new order', async () => {
      const newOrder: Order = {
        id: 'order-new',
        userId: 'user-1',
        merchantId: 'merchant-1',
        driverId: '',
        status: 'CREATED',
        totalPrice: 45000,
        deliveryFee: 10000,
        paymentStatus: 'PENDING',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(newOrder)),
      });

      const { result } = renderHook(() => useCreateOrder(), {
        wrapper: createWrapper(),
      });

      const orderData = {
        merchantId: 'merchant-1',
        items: [
          { variantId: 'variant-1', quantity: 2, price: 20000 },
        ],
        totalPrice: 45000,
        deliveryFee: 10000,
      };

      await act(async () => {
        result.current.mutate(orderData);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(newOrder);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(orderData),
        })
      );
    });

    it('should handle order creation error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ message: 'Invalid order data', statusCode: 400 }),
      });

      const { result } = renderHook(() => useCreateOrder(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          merchantId: '',
          items: [],
          totalPrice: 0,
        });
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual({
        message: 'Invalid order data',
        statusCode: 400,
      });
    });
  });

  describe('useCancelOrder', () => {
    it('should cancel an order', async () => {
      const cancelledOrder = { ...mockOrders[0], status: 'CANCELLED' };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(cancelledOrder)),
      });

      const { result } = renderHook(() => useCancelOrder(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate('order-1');
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(cancelledOrder);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/order-1/cancelled'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });
});
