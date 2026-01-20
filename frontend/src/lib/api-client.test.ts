import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient, ApiError } from './api-client';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('get', () => {
    it('should make GET request with correct URL', async () => {
      const mockData = { id: '1', name: 'Test' };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should append query parameters', async () => {
      const mockData = [];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      await apiClient.get('/test', { page: 1, limit: 10 });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
    });

    it('should include credentials for cookies', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{}'),
      });

      await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: 'include',
        })
      );
    });

    it('should throw error on non-ok response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Resource not found', statusCode: 404 }),
      });

      await expect(apiClient.get('/not-found')).rejects.toEqual({
        message: 'Resource not found',
        statusCode: 404,
      });
    });

    it('should handle empty response body', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      });

      const result = await apiClient.get('/empty');

      expect(result).toEqual({});
    });
  });

  describe('post', () => {
    it('should make POST request with body', async () => {
      const mockData = { id: '1', success: true };
      const body = { email: 'test@example.com', password: 'password' };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await apiClient.post('/auth/login', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle POST without body', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{}'),
      });

      await apiClient.post('/auth/logout');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });
  });

  describe('put', () => {
    it('should make PUT request with body', async () => {
      const mockData = { id: '1', name: 'Updated' };
      const body = { name: 'Updated' };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await apiClient.put('/users/1', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('patch', () => {
    it('should make PATCH request', async () => {
      const mockData = { id: '1', status: 'updated' };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await apiClient.patch('/orders/1', { status: 'COMPLETED' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/1'),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('delete', () => {
    it('should make DELETE request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('{}'),
      });

      await apiClient.delete('/users/1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'DELETE',
          credentials: 'include',
        })
      );
    });
  });

  describe('error handling', () => {
    it('should parse JSON error response', async () => {
      const errorResponse = { message: 'Invalid credentials', statusCode: 401 };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve(errorResponse),
      });

      await expect(apiClient.post('/auth/login', {})).rejects.toEqual(errorResponse);
    });

    it('should fallback to statusText if JSON parsing fails', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(apiClient.get('/error')).rejects.toEqual({
        message: 'Internal Server Error',
        statusCode: 500,
      });
    });
  });
});
