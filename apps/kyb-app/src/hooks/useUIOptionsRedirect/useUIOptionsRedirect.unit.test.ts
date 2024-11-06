import { StateManagerContext } from '@/components/organisms/DynamicUI';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UISchema } from '@/domains/collection-flow';
import { CollectionFlowConfig } from '@/domains/collection-flow/types/flow-context.types';
import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUIOptionsRedirect } from './useUIOptionsRedirect';

// Mock all required hooks
vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider', () => ({
  useStateManagerContext: vi.fn(),
}));

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('@/hooks/useUISchemasQuery', () => ({
  useUISchemasQuery: vi.fn(),
}));

describe('useUIOptionsRedirect', () => {
  const mockConfig = {
    uiOptions: {
      redirectUrls: {
        success: 'https://success.com',
        failure: 'https://failure.com',
      },
    },
  };

  const mockData = {
    uiOptions: {
      redirectUrls: {
        success: 'https://data-success.com',
        failure: 'https://data-failure.com',
      },
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock default implementations
    //@ts-ignore
    vi.mocked(useStateManagerContext).mockReturnValue({
      config: {} as CollectionFlowConfig,
    });
    vi.mocked(useLanguage).mockReturnValue('en');
    vi.mocked(useUISchemasQuery).mockReturnValue({ data: null, isLoading: false, error: null });

    // Mock window.location
    const locationMock = {
      href: '',
    };
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });

    // Mock console.info
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  it('should prioritize config redirectUrls over data redirectUrls', () => {
    vi.mocked(useStateManagerContext).mockReturnValue({
      config: mockConfig,
    } as StateManagerContext);
    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: mockData as UISchema,
      isLoading: false,
      error: null,
    });

    renderHook(() => useUIOptionsRedirect('success'));

    expect(window.location.href).toBe(mockConfig.uiOptions.redirectUrls.success);
  });

  it('should use data redirectUrls when config is not available', () => {
    vi.mocked(useStateManagerContext).mockReturnValue({
      config: null,
    } as unknown as StateManagerContext);
    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: mockData as UISchema,
      isLoading: false,
      error: null,
    });

    renderHook(() => useUIOptionsRedirect('success'));

    expect(window.location.href).toBe(mockData.uiOptions.redirectUrls.success);
  });

  it('should not redirect when no redirectUrls are available', () => {
    vi.mocked(useStateManagerContext).mockReturnValue({
      config: null,
    } as unknown as StateManagerContext);
    vi.mocked(useUISchemasQuery).mockReturnValue({ data: null, isLoading: false, error: null });

    const originalHref = window.location.href;
    renderHook(() => useUIOptionsRedirect('success'));

    expect(window.location.href).toBe(originalHref);
  });

  it('should redirect to failure URL when state is failure', () => {
    vi.mocked(useStateManagerContext).mockReturnValue({
      config: mockConfig,
    } as StateManagerContext);

    renderHook(() => useUIOptionsRedirect('failure'));

    expect(window.location.href).toBe(mockConfig.uiOptions.redirectUrls.failure);
  });

  it('should log info message when redirecting', () => {
    vi.mocked(useStateManagerContext).mockReturnValue({
      config: mockConfig,
    } as StateManagerContext);

    renderHook(() => useUIOptionsRedirect('success'));

    expect(console.info).toHaveBeenCalledWith(
      'Collection Flow resolved to success. Redirecting to https://success.com',
    );
  });
});
