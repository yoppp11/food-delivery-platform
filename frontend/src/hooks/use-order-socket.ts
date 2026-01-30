import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Order, OrderStatus, Driver } from '@/types';

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

interface UseOrderSocketOptions {
  userId: string;
  role?: string;
  enabled?: boolean;
}

interface OrderUpdate {
  orderId: string;
  status?: OrderStatus;
  driverId?: string;
  driver?: Driver;
}

export function useOrderSocket({
  userId,
  role,
  enabled = true,
}: UseOrderSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !userId) return;

    const socket = io(`${SOCKET_URL}/orders`, {
      auth: { userId, role },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('order:updated', (update: OrderUpdate) => {
      queryClient.setQueryData<Order>(
        queryKeys.orders.tracking(update.orderId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            status: update.status ?? old.status,
            driver: update.driver ?? old.driver,
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(update.orderId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.active() });
    });

    socket.on(
      'order:driver-assigned',
      (data: { orderId: string; driver: Driver }) => {
        queryClient.setQueryData<Order>(
          queryKeys.orders.tracking(data.orderId),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              driver: data.driver,
              driverId: data.driver?.id,
            };
          },
        );
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.detail(data.orderId),
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.active() });
      },
    );

    socket.on('order:new-assignment', () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.driver.availableOrders(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.driver.activeOrder(),
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, role, enabled, queryClient]);

  const subscribeToOrder = useCallback((orderId: string) => {
    socketRef.current?.emit('order:subscribe', { orderId });
  }, []);

  const unsubscribeFromOrder = useCallback((orderId: string) => {
    socketRef.current?.emit('order:unsubscribe', { orderId });
  }, []);

  return {
    isConnected,
    subscribeToOrder,
    unsubscribeFromOrder,
  };
}
