import { ITheme } from '@/common/types/settings';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { finalSubmissionRequest, UISchema } from '@/domains/collection-flow';
import { useFlowTracking } from '@/hooks/useFlowTracking';
import { CollectionFlowEvents } from '@/hooks/useFlowTracking/enums';
import { useLanguage } from '@/hooks/useLanguage';
import { useRedirectUrls } from '@/hooks/useRedirectUrls/useRedirectUrls';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { getOrderedSteps } from '@ballerine/common';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFinalSubmission } from './useFinalSubmission';

// Mock dependencies
vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider', () => ({
  useStateManagerContext: vi.fn(),
}));

vi.mock('@/domains/collection-flow', () => ({
  finalSubmissionRequest: vi.fn(),
}));

vi.mock('@/hooks/useFlowTracking', () => ({
  useFlowTracking: vi.fn(),
}));

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: vi.fn(),
}));

vi.mock('@/hooks/useRedirectUrls/useRedirectUrls', () => ({
  useRedirectUrls: vi.fn(),
}));

vi.mock('@/hooks/useUISchemasQuery', () => ({
  useUISchemasQuery: vi.fn(),
}));

vi.mock('@ballerine/common', () => ({
  getOrderedSteps: vi.fn(),
}));

describe('useFinalSubmission', () => {
  const mockContext = {};
  const mockState = 'verification';
  const mockSchema: Partial<UISchema> = {
    id: 'test-id',
    config: {
      supportedLanguages: ['en'],
    },
    uiSchema: {
      elements: [],
      theme: {} as ITheme,
    },
    definition: {
      definitionType: 'test',
      definition: {},
      extensions: {},
    },
    version: 1,
  };
  const mockSteps = ['welcome', 'verification', 'completed'];
  const mockSendEvent = vi.fn();
  const mockTrackEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useLanguage).mockReturnValue('en');
    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: mockSchema as UISchema,
      isLoading: false,
      error: null,
    });
    vi.mocked(useRedirectUrls).mockReturnValue(null);
    vi.mocked(useStateManagerContext).mockReturnValue({
      stateApi: {
        sendEvent: mockSendEvent,
        invokePlugin: vi.fn(),
        setContext: vi.fn(),
        getContext: vi.fn(),
        getState: vi.fn(),
      } as unknown as ReturnType<typeof useStateManagerContext>['stateApi'],
      state: '',
      config: {},
      payload: {} as any,
      isPluginLoading: false,
    });
    vi.mocked(useFlowTracking).mockReturnValue({
      trackEvent: mockTrackEvent,
    });
    vi.mocked(getOrderedSteps).mockReturnValue(mockSteps);
    vi.mocked(finalSubmissionRequest).mockResolvedValue(undefined);
  });

  it('should determine if final submission is available based on current state', () => {
    // Arrange
    vi.mocked(getOrderedSteps).mockReturnValue(['step1', 'step2', 'verification']);

    // Act
    const { result } = renderHook(() => useFinalSubmission(mockContext, 'verification'));

    // Assert
    expect(result.current.isFinalSubmissionAvailable).toBe(true);
  });

  it('should determine final submission is not available when not on last step', () => {
    // Arrange
    vi.mocked(getOrderedSteps).mockReturnValue(['step1', 'verification', 'completed']);

    // Act
    const { result } = renderHook(() => useFinalSubmission(mockContext, 'verification'));

    // Assert
    expect(result.current.isFinalSubmissionAvailable).toBe(false);
  });

  it('should handle final submission with redirectUrls when successful', async () => {
    // Arrange
    const mockRedirectUrls = {
      success: 'https://success.com',
      failure: 'https://failure.com',
    };
    vi.mocked(useRedirectUrls).mockReturnValue(mockRedirectUrls);

    // Mock the location.href property
    const originalLocation = window.location;
    const locationRef = { ...originalLocation, href: '' };
    Object.defineProperty(window, 'location', {
      writable: true,
      value: locationRef,
    });

    // Act
    const { result } = renderHook(() => useFinalSubmission(mockContext, mockState));
    await result.current.handleFinalSubmission();

    // Assert
    expect(finalSubmissionRequest).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith(CollectionFlowEvents.FLOW_COMPLETED);
    expect(window.location.href).toBe(mockRedirectUrls.success);

    // Cleanup
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('should throw error when final submission fails', async () => {
    // Arrange
    const mockError = new Error('Failed');
    vi.mocked(finalSubmissionRequest).mockRejectedValue(mockError);

    // Act
    const { result } = renderHook(() => useFinalSubmission(mockContext, mockState));

    // Assert
    await expect(result.current.handleFinalSubmission()).rejects.toThrow(mockError);
    expect(finalSubmissionRequest).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith(CollectionFlowEvents.FLOW_FAILED);
  });

  it('should handle final submission without redirectUrls when successful', async () => {
    // Arrange
    vi.mocked(useRedirectUrls).mockReturnValue(null);

    // Act
    const { result } = renderHook(() => useFinalSubmission(mockContext, mockState));
    await result.current.handleFinalSubmission();

    // Assert
    expect(finalSubmissionRequest).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith('NEXT');
    expect(mockSendEvent).toHaveBeenCalledWith('COMPLETED');
    expect(mockTrackEvent).toHaveBeenCalledWith(CollectionFlowEvents.FLOW_COMPLETED);
  });

  it('should not redirect if success URL is not provided', async () => {
    // Arrange
    const mockRedirectUrls = {
      failure: 'https://failure.com',
    };
    vi.mocked(useRedirectUrls).mockReturnValue(mockRedirectUrls);

    // Mock the location.href property
    const originalLocation = window.location;
    const locationRef = { ...originalLocation, href: '' };
    Object.defineProperty(window, 'location', {
      writable: true,
      value: locationRef,
    });

    // Act
    const { result } = renderHook(() => useFinalSubmission(mockContext, mockState));
    await result.current.handleFinalSubmission();

    // Assert
    expect(finalSubmissionRequest).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith(CollectionFlowEvents.FLOW_COMPLETED);
    expect(mockSendEvent).toHaveBeenCalledWith('NEXT');
    expect(mockSendEvent).toHaveBeenCalledWith('COMPLETED');
    expect(window.location.href).toBe(''); // Should remain empty since success URL is not provided

    // Cleanup
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('should set isFinalSubmitted to true when final submission is successful', async () => {
    // Arrange
    vi.mocked(useRedirectUrls).mockReturnValue(null);
    vi.mocked(finalSubmissionRequest).mockResolvedValue(undefined);

    // Act
    const { result, rerender } = renderHook(() => useFinalSubmission(mockContext, mockState));
    await result.current.handleFinalSubmission();
    rerender();

    // Assert
    expect(result.current.isFinalSubmitted).toBe(true);
  });

  it('should not set isFinalSubmitted to true when final submission fails', async () => {
    // Arrange
    vi.mocked(useRedirectUrls).mockReturnValue(null);
    vi.mocked(finalSubmissionRequest).mockRejectedValue(new Error('Failed'));

    // Act
    const { result } = renderHook(() => useFinalSubmission(mockContext, mockState));

    // We expect the promise to reject
    await expect(result.current.handleFinalSubmission()).rejects.toThrow();

    // Assert
    expect(result.current.isFinalSubmitted).toBe(false);
  });
});
