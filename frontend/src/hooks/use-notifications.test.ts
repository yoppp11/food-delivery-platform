import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createWrapper, createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from './use-notifications';
import type { Notification } from '@/types';

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'ORDER',
    message: 'Your order is being prepared',
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'PROMO',
    message: 'New promotion available!',
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'ORDER',
    message: 'Your order has been delivered',
    isRead: true,
    createdAt: new Date(),
  },
];

describe('Notification Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useNotifications', () => {
    it('should fetch notifications', async () => {
      const mockResponse = {
        data: mockNotifications,
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
    });

    it('should fetch notifications with filters', async () => {
      const mockResponse = {
        data: mockNotifications.filter((n) => !n.isRead),
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const { result } = renderHook(
        () => useNotifications({ isRead: false }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('isRead=false'),
        expect.any(Object)
      );
    });
  });

  describe('useUnreadNotificationCount', () => {
    it('should fetch unread count', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ count: 2 })),
      });

      const { result } = renderHook(() => useUnreadNotificationCount(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({ count: 2 });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/unread/count'),
        expect.any(Object)
      );
    });
  });

  describe('useMarkNotificationAsRead', () => {
    it('should mark a notification as read', async () => {
      const updatedNotification = { ...mockNotifications[0], isRead: true };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(updatedNotification)),
      });

      const { result } = renderHook(() => useMarkNotificationAsRead(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate('notif-1');
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(updatedNotification);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/notif-1/read'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });

    it('should optimistically update notification list', async () => {
      const queryClient = createTestQueryClient();

      // Pre-populate notifications
      const mockResponse = {
        data: mockNotifications,
        pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
      };
      queryClient.setQueryData(['notifications', 'list', {}], mockResponse);
      queryClient.setQueryData(['notifications', 'count'], { count: 2 });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () =>
          Promise.resolve(JSON.stringify({ ...mockNotifications[0], isRead: true })),
      });

      const { result } = renderHook(() => useMarkNotificationAsRead(), { wrapper });

      await act(async () => {
        result.current.mutate('notif-1');
      });

      // Check optimistic update
      const cachedCount = queryClient.getQueryData(['notifications', 'count']) as { count: number };
      expect(cachedCount.count).toBe(1); // Count should have decreased

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
  });

  describe('useMarkAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ count: 2 })),
      });

      const { result } = renderHook(() => useMarkAllNotificationsAsRead(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate();
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/read-all'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });

    it('should optimistically clear unread state', async () => {
      const queryClient = createTestQueryClient();

      // Pre-populate
      queryClient.setQueryData(['notifications', 'unread'], mockNotifications.filter((n) => !n.isRead));
      queryClient.setQueryData(['notifications', 'count'], { count: 2 });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ count: 2 })),
      });

      const { result } = renderHook(() => useMarkAllNotificationsAsRead(), { wrapper });

      await act(async () => {
        result.current.mutate();
      });

      // Check optimistic updates
      const cachedUnread = queryClient.getQueryData(['notifications', 'unread']) as Notification[];
      const cachedCount = queryClient.getQueryData(['notifications', 'count']) as { count: number };

      expect(cachedUnread).toEqual([]);
      expect(cachedCount.count).toBe(0);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
  });
});
