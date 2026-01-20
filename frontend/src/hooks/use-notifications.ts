import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Notification } from '@/types';

interface NotificationListResponse {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: () =>
      apiClient.get<NotificationListResponse>('/notifications', filters as Record<string, string | number | boolean>),
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.unread(),
    queryFn: () => apiClient.get<Notification[]>('/notifications/unread'),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.count(),
    queryFn: () => apiClient.get<{ count: number }>('/notifications/unread/count'),
    refetchInterval: 30000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.patch<Notification>(`/notifications/${id}/read`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      const previousNotifications = queryClient.getQueryData<NotificationListResponse>(
        queryKeys.notifications.list({})
      );
      const previousUnread = queryClient.getQueryData<Notification[]>(
        queryKeys.notifications.unread()
      );
      const previousCount = queryClient.getQueryData<{ count: number }>(
        queryKeys.notifications.count()
      );

      queryClient.setQueryData<NotificationListResponse>(
        queryKeys.notifications.list({}),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          };
        }
      );

      queryClient.setQueryData<Notification[]>(queryKeys.notifications.unread(), (old) => {
        if (!old) return old;
        return old.filter((n) => n.id !== id);
      });

      queryClient.setQueryData<{ count: number }>(queryKeys.notifications.count(), (old) => {
        if (!old) return old;
        return { count: Math.max(0, old.count - 1) };
      });

      return { previousNotifications, previousUnread, previousCount };
    },
    onError: (_, __, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications.list({}), context.previousNotifications);
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(queryKeys.notifications.unread(), context.previousUnread);
      }
      if (context?.previousCount) {
        queryClient.setQueryData(queryKeys.notifications.count(), context.previousCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.patch<{ count: number }>('/notifications/read-all'),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      const previousNotifications = queryClient.getQueryData<NotificationListResponse>(
        queryKeys.notifications.list({})
      );

      queryClient.setQueryData<NotificationListResponse>(
        queryKeys.notifications.list({}),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((n) => ({ ...n, isRead: true })),
          };
        }
      );

      queryClient.setQueryData<Notification[]>(queryKeys.notifications.unread(), []);
      queryClient.setQueryData<{ count: number }>(queryKeys.notifications.count(), { count: 0 });

      return { previousNotifications };
    },
    onError: (_, __, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications.list({}), context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<Notification>(`/notifications/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.all });

      const previousNotifications = queryClient.getQueryData<NotificationListResponse>(
        queryKeys.notifications.list({})
      );

      queryClient.setQueryData<NotificationListResponse>(
        queryKeys.notifications.list({}),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((n) => n.id !== id),
          };
        }
      );

      return { previousNotifications };
    },
    onError: (_, __, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications.list({}), context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useClearAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete<{ count: number }>('/notifications/clear'),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.notifications.list({}), { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });
      queryClient.setQueryData(queryKeys.notifications.unread(), []);
      queryClient.setQueryData(queryKeys.notifications.count(), { count: 0 });
    },
  });
}

export default {
  useNotifications,
  useUnreadNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useClearAllNotifications,
};
