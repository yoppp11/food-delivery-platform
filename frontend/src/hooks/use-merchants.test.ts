import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/test-utils';
import { useMerchants, useMerchant, useFeaturedMerchants } from './use-merchants';
import type { Merchant } from '@/types';

const mockMerchants: Merchant[] = [
  {
    id: '1',
    ownerId: 'owner1',
    name: 'Test Restaurant',
    description: 'A great restaurant',
    latitude: -6.2088,
    longitude: 106.8456,
    isOpen: true,
    rating: 4.5,
    createdAt: new Date(),
  },
  {
    id: '2',
    ownerId: 'owner2',
    name: 'Another Restaurant',
    description: 'Another great restaurant',
    latitude: -6.2100,
    longitude: 106.8470,
    isOpen: false,
    rating: 4.0,
    createdAt: new Date(),
  },
];

describe('Merchant Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useMerchants', () => {
    it('should fetch merchants successfully', async () => {
      const mockResponse = {
        data: mockMerchants,
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const { result } = renderHook(() => useMerchants(), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/merchants'),
        expect.any(Object)
      );
    });

    it('should fetch merchants with filters', async () => {
      const mockResponse = {
        data: [mockMerchants[0]],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const { result } = renderHook(
        () => useMerchants({ search: 'Test', page: 1, limit: 10 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=Test'),
        expect.any(Object)
      );
    });

    it('should handle fetch error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ message: 'Server error', statusCode: 500 }),
      });

      const { result } = renderHook(() => useMerchants(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useMerchant', () => {
    it('should fetch a single merchant by ID', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockMerchants[0])),
      });

      const { result } = renderHook(() => useMerchant('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockMerchants[0]);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/merchants/1'),
        expect.any(Object)
      );
    });

    it('should not fetch when ID is empty', async () => {
      global.fetch = vi.fn();

      const { result } = renderHook(() => useMerchant(''), {
        wrapper: createWrapper(),
      });

      // Should not be loading because query is disabled
      expect(result.current.isLoading).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('useFeaturedMerchants', () => {
    it('should fetch featured merchants', async () => {
      const featuredMerchants = mockMerchants.filter((m) => m.isOpen);

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(featuredMerchants)),
      });

      const { result } = renderHook(() => useFeaturedMerchants(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(featuredMerchants);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/merchants/featured'),
        expect.any(Object)
      );
    });

    it('should pass limit parameter', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockMerchants)),
      });

      const { result } = renderHook(() => useFeaturedMerchants(5), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=5'),
        expect.any(Object)
      );
    });
  });
});
