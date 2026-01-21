import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { User } from '@/types';

interface Session {
  user: User | null;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  } | null;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
}

interface UpdateUserData {
  name?: string;
  image?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      try {
        const session = await apiClient.get<Session>('/auth/get-session');
        return session;
      } catch {
        return { user: null, session: null };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useIsAuthenticated() {
  const { data: session, isLoading } = useSession();
  return {
    isAuthenticated: !!session?.user,
    isLoading,
    user: session?.user ?? null,
  };
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignInCredentials) =>
      apiClient.post<AuthResponse>('/auth/sign-in/email', credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all });
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignUpCredentials) =>
      apiClient.post<AuthResponse>('/auth/sign-up/email', credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.session(), {
        user: data.user,
        session: data.session,
      });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post<{ success: boolean }>('/auth/sign-out'),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.session(), { user: null, session: null });
      queryClient.removeQueries({ queryKey: queryKeys.cart.all });
      queryClient.removeQueries({ queryKey: queryKeys.orders.all });
      queryClient.removeQueries({ queryKey: queryKeys.notifications.all });
      queryClient.removeQueries({ queryKey: queryKeys.addresses.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) =>
      apiClient.post<{ user: User }>('/auth/update-user', data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.session(), (oldData: Session | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          user: data.user,
        };
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) =>
      apiClient.post<{ success: boolean }>('/auth/change-password', data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      apiClient.post<{ success: boolean; message: string }>('/auth/forget-password', { email }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      apiClient.post<{ success: boolean }>('/auth/reset-password', data),
  });
}

export default {
  useSession,
  useIsAuthenticated,
  useSignIn,
  useSignUp,
  useSignOut,
  useUpdateUser,
  useChangePassword,
  useForgotPassword,
  useResetPassword,
};
