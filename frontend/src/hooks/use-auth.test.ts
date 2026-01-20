import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createWrapper, createTestQueryClient } from '@/test/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useSession,
  useIsAuthenticated,
  useSignIn,
  useSignUp,
  useSignOut,
} from './use-auth';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  emailVerified: true,
  role: 'CUSTOMER',
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSession = {
  user: mockUser,
  session: {
    id: 'session-1',
    userId: '1',
    expiresAt: '2026-02-19T00:00:00.000Z',
  },
};

describe('Auth Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSession', () => {
    it('should return session when authenticated', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockSession)),
      });

      const { result } = renderHook(() => useSession(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSession);
      expect(result.current.data?.user).toEqual(mockUser);
    });

    it('should return null session when not authenticated', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.reject(),
      });

      const { result } = renderHook(() => useSession(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({ user: null, session: null });
    });
  });

  describe('useIsAuthenticated', () => {
    it('should return isAuthenticated true when session exists', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockSession)),
      });

      const { result } = renderHook(() => useIsAuthenticated(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('should return isAuthenticated false when no session', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ user: null, session: null })),
      });

      const { result } = renderHook(() => useIsAuthenticated(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('useSignIn', () => {
    it('should sign in successfully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockSession)),
      });

      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSession);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/sign-in/email'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
    });

    it('should handle sign in error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ message: 'Invalid credentials', statusCode: 401 }),
      });

      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual({
        message: 'Invalid credentials',
        statusCode: 401,
      });
    });
  });

  describe('useSignUp', () => {
    it('should sign up successfully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockSession)),
      });

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/sign-up/email'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
          }),
        })
      );
    });
  });

  describe('useSignOut', () => {
    it('should sign out successfully', async () => {
      const queryClient = createTestQueryClient();

      // Pre-populate session
      queryClient.setQueryData(['auth', 'session'], mockSession);

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      });

      const { result } = renderHook(() => useSignOut(), { wrapper });

      await act(async () => {
        result.current.mutate();
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check that session was cleared
      const session = queryClient.getQueryData(['auth', 'session']);
      expect(session).toEqual({ user: null, session: null });
    });
  });
});
