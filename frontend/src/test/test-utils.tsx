import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Create a fresh QueryClient for each test
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper component for tests that provides all necessary providers
 */
interface WrapperProps {
  children: ReactNode;
}

export function createWrapper() {
  const queryClient = createTestQueryClient();

  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

/**
 * Custom render function that wraps component with providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: createWrapper(), ...options });
}

/**
 * Mock successful API response
 */
export function mockFetchSuccess<T>(data: T) {
  return vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

/**
 * Mock failed API response
 */
export function mockFetchError(status: number, message: string) {
  return vi.fn().mockResolvedValueOnce({
    ok: false,
    status,
    statusText: message,
    json: () => Promise.resolve({ message, statusCode: status }),
  });
}

/**
 * Wait for React Query to settle
 */
export function waitForQueryToSettle() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { vi } from 'vitest';
