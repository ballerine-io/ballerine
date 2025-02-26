import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { UIOptions, UISchema } from '@/domains/collection-flow';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLanguage } from '../useLanguage';
import { useUISchemasQuery } from '../useUISchemasQuery';
import { useRedirectUrls } from './useRedirectUrls';

// Mock the dependencies
vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider', () => ({
  useStateManagerContext: vi.fn(),
}));

vi.mock('../useUISchemasQuery', () => ({
  useUISchemasQuery: vi.fn(),
}));

vi.mock('../useLanguage', () => ({
  useLanguage: vi.fn().mockReturnValue('en'),
}));

describe('useRedirectUrls', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useStateManagerContext).mockReturnValue({
      config: {},
      state: '' as string,
      stateApi: {
        invokePlugin: vi.fn(),
        sendEvent: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } as unknown as ReturnType<typeof useStateManagerContext>['stateApi'],
      payload: {} as any,
      isPluginLoading: false,
    });

    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  it('should return null when no redirectUrls are available', () => {
    // Act
    const { result } = renderHook(() => useRedirectUrls());

    // Assert
    expect(result.current).toBeNull();
  });

  it('should prioritize config redirectUrls over data redirectUrls', () => {
    // Arrange
    const configRedirectUrls = {
      success: 'https://config-success.com',
      failure: 'https://config-failure.com',
    };

    const dataRedirectUrls = {
      success: 'https://data-success.com',
      failure: 'https://data-failure.com',
    };

    vi.mocked(useStateManagerContext).mockReturnValue({
      config: {
        uiOptions: {
          redirectUrls: configRedirectUrls,
        },
      },
      state: '' as string,
      stateApi: {
        invokePlugin: vi.fn(),
        sendEvent: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } as unknown as ReturnType<typeof useStateManagerContext>['stateApi'],
      payload: {} as any,
      isPluginLoading: false,
    });

    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: {
        id: 'test-id',
        config: {},
        uiSchema: {},
        definition: { definition: {} },
        uiOptions: {
          redirectUrls: dataRedirectUrls,
        },
        version: '1.0',
        createdAt: '',
        updatedAt: '',
      } as unknown as UISchema,
      isLoading: false,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useRedirectUrls());

    // Assert
    expect(result.current).toEqual(configRedirectUrls);
  });

  it('should use data redirectUrls when config redirectUrls are not available', () => {
    // Arrange
    const dataRedirectUrls = {
      success: 'https://data-success.com',
      failure: 'https://data-failure.com',
    };

    vi.mocked(useStateManagerContext).mockReturnValue({
      config: {},
      state: '' as string,
      stateApi: {
        invokePlugin: vi.fn(),
        sendEvent: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } as unknown as ReturnType<typeof useStateManagerContext>['stateApi'],
      payload: {} as any,
      isPluginLoading: false,
    });

    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: {
        id: 'test-id',
        config: {},
        uiSchema: {},
        definition: { definition: {} },
        uiOptions: {
          redirectUrls: dataRedirectUrls,
        },
        version: '1.0',
        createdAt: '',
        updatedAt: '',
      } as unknown as UISchema,
      isLoading: false,
      error: null,
    });

    // Act
    const { result } = renderHook(() => useRedirectUrls());

    // Assert
    expect(result.current).toEqual(dataRedirectUrls);
  });

  it('should return null when uiOptions exists but redirectUrls is not defined', () => {
    // Arrange
    vi.mocked(useStateManagerContext).mockReturnValue({
      config: {
        uiOptions: {} as UIOptions,
      },
      state: '' as string,
      stateApi: {
        invokePlugin: vi.fn(),
        sendEvent: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } as unknown as ReturnType<typeof useStateManagerContext>['stateApi'],
      payload: {} as any,
      isPluginLoading: false,
    });

    // Act
    const { result } = renderHook(() => useRedirectUrls());

    // Assert
    expect(result.current).toBeNull();
  });

  it('should call useUISchemasQuery with the correct language', () => {
    // Arrange
    vi.mocked(useLanguage).mockReturnValue('fr');

    // Act
    renderHook(() => useRedirectUrls());

    // Assert
    expect(useUISchemasQuery).toHaveBeenCalledWith('fr');
  });
});
