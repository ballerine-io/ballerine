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
    const mockStateManagerContextDefault = {
      config: {},
      state: '',
      stateApi: {
        invokePlugin: vi.fn(),
        sendEvent: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } satisfies ReturnType<typeof useStateManagerContext>['stateApi'],
      // @ts-expect-error
      payload: {},
      isPluginLoading: false,
    } satisfies ReturnType<typeof useStateManagerContext>;
    const mockUISchemasQueryResultDefault = {
      data: null,
      isLoading: false,
      error: null,
    } satisfies ReturnType<typeof useUISchemasQuery>;

    vi.mocked(useStateManagerContext).mockReturnValue(
      // @ts-expect-error
      mockStateManagerContextDefault,
    );
    vi.mocked(useUISchemasQuery).mockReturnValue(mockUISchemasQueryResultDefault);
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

    const mockStateManagerContextConfig = {
      config: {
        uiOptions: {
          redirectUrls: configRedirectUrls,
        },
      },
      state: '',
      stateApi: {
        invokePlugin: vi.fn(),
        sendEvent: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } satisfies ReturnType<typeof useStateManagerContext>['stateApi'],
      // @ts-expect-error
      payload: {},
      isPluginLoading: false,
    } satisfies ReturnType<typeof useStateManagerContext>;

    const mockUISchemasQueryResultConfig = {
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
    } satisfies ReturnType<typeof useUISchemasQuery>;

    vi.mocked(useStateManagerContext).mockReturnValue(
      // @ts-expect-error
      mockStateManagerContextConfig,
    );
    vi.mocked(useUISchemasQuery).mockReturnValue(mockUISchemasQueryResultConfig);

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

    const mockStateManagerContextData = {
      config: {},
      state: '',
      stateApi: {
        invokePlugin: vi.fn(),
        sendEvent: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } satisfies ReturnType<typeof useStateManagerContext>['stateApi'],
      // @ts-expect-error
      payload: {},
      isPluginLoading: false,
    } satisfies ReturnType<typeof useStateManagerContext>;

    const mockUISchemasQueryResultData = {
      data: {
        id: 'test-id',
        // @ts-expect-error
        config: {},
        // @ts-expect-error
        uiSchema: {},
        // @ts-expect-error
        definition: { definition: {} },
        uiOptions: {
          redirectUrls: dataRedirectUrls,
        },
        // @ts-expect-error
        version: '1.0',
        // @ts-expect-error
        createdAt: '',
        updatedAt: '',
      } satisfies UISchema,
      isLoading: false,
      error: null,
    } satisfies ReturnType<typeof useUISchemasQuery>;

    vi.mocked(useStateManagerContext).mockReturnValue(
      // @ts-expect-error
      mockStateManagerContextData,
    );
    vi.mocked(useUISchemasQuery).mockReturnValue(
      // @ts-expect-error
      mockUISchemasQueryResultData,
    );

    // Act
    const { result } = renderHook(() => useRedirectUrls());

    // Assert
    expect(result.current).toEqual(dataRedirectUrls);
  });

  it('should return null when uiOptions exists but redirectUrls is not defined', () => {
    // Arrange
    const mockStateManagerContextNoRedirect = {
      config: {
        uiOptions: {} satisfies UIOptions,
      },
      state: '',
      stateApi: {
        invokePlugin: vi.fn(),
        sendEvent: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } satisfies ReturnType<typeof useStateManagerContext>['stateApi'],
      // @ts-expect-error
      payload: {},
      isPluginLoading: false,
    } satisfies ReturnType<typeof useStateManagerContext>;

    const mockUISchemasQueryResultNoRedirect = {
      data: {
        id: 'test-id',
        // @ts-expect-error
        config: {},
        // @ts-expect-error
        uiSchema: {},
        // @ts-expect-error
        definition: { definition: {} },
        uiOptions: {} satisfies UIOptions,
        // @ts-expect-error
        version: '1.0',
        createdAt: '',
        updatedAt: '',
      },
      isLoading: false,
      error: null,
    } satisfies ReturnType<typeof useUISchemasQuery>;

    vi.mocked(useStateManagerContext).mockReturnValue(
      // @ts-expect-error
      mockStateManagerContextNoRedirect,
    );
    vi.mocked(useUISchemasQuery).mockReturnValue(
      // @ts-expect-error
      mockUISchemasQueryResultNoRedirect,
    );

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
