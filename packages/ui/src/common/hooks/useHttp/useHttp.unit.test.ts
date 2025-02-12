import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHttp } from './useHttp';
import { request } from './utils/request';

vi.mock('./utils/request', () => ({
  request: vi.fn(),
}));

describe('useHttp', () => {
  const mockParams = {
    url: 'test-url',
    resultPath: 'data.items',
    method: 'GET' as const,
    headers: {},
  };

  const mockMetadata = {
    token: 'test-token',
  };

  const mockResponse = {
    data: {
      items: ['item1', 'item2'],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useHttp(mockParams, mockMetadata));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.run).toBe('function');
  });

  it('should handle successful request', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useHttp(mockParams, mockMetadata));

    const response = await result.current.run();

    expect(request).toHaveBeenCalledWith(
      {
        ...mockParams,
        url: mockParams.url,
      },
      mockMetadata,
      undefined,
      undefined,
    );
    expect(response).toEqual(['item1', 'item2']);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle request with payload', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);
    const payload = { test: 'payload' };

    const { result } = renderHook(() => useHttp(mockParams, mockMetadata));

    await result.current.run(payload);

    expect(request).toHaveBeenCalledWith(
      {
        ...mockParams,
        url: mockParams.url,
      },
      mockMetadata,
      payload,
      undefined,
    );
  });

  it('should handle request without resultPath', async () => {
    const paramsWithoutPath = {
      url: 'test-url',
      resultPath: '',
      method: 'GET' as const,
      headers: {},
    };
    vi.mocked(request).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useHttp(paramsWithoutPath, mockMetadata));

    const response = await result.current.run();

    expect(response).toEqual(mockResponse);
  });

  it('should handle error', async () => {
    const mockError = new Error('Test error');
    vi.mocked(request).mockRejectedValueOnce(mockError);

    const { result, rerender } = renderHook(() => useHttp(mockParams, mockMetadata));

    await expect(result.current.run()).rejects.toThrow('Test error');

    rerender();

    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
  });

  it('should set loading state during request', async () => {
    vi.mocked(request).mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(mockResponse), 100);
        }),
    );

    const { result, rerender } = renderHook(() => useHttp(mockParams, mockMetadata));

    const promise = result.current.run();
    rerender();

    expect(result.current.isLoading).toBe(true);

    await promise;

    rerender();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle request with additional params', async () => {
    vi.mocked(request).mockResolvedValueOnce(mockResponse);
    const additionalParams = { page: 1 };

    const { result } = renderHook(() => useHttp(mockParams, mockMetadata));

    await result.current.run(undefined, { params: additionalParams });

    expect(request).toHaveBeenCalledWith(
      {
        ...mockParams,
        url: mockParams.url,
      },
      mockMetadata,
      undefined,
      additionalParams,
    );
  });
});
