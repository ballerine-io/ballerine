import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IEventsListener, IEventsProviderContext } from '../../../types';
import { useEventsProvider } from '../../internal/useEventsProvider';
import { useEventsConsumer } from './useEventsConsumer';

vi.mock('../../internal/useEventsProvider', () => ({
  useEventsProvider: vi.fn(),
}));

describe('useEventsConsumer', () => {
  const mockSubscribe = vi.fn();
  const mockUnsubscribe = vi.fn();
  const mockListener = {
    id: '1',
    eventName: 'onChange',
    callback: vi.fn(),
  } as unknown as IEventsListener;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEventsProvider).mockReturnValue({
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
    } as unknown as IEventsProviderContext);
  });

  it('should call useEventsProvider', () => {
    renderHook(() => useEventsConsumer(mockListener));
    expect(useEventsProvider).toHaveBeenCalled();
  });

  it('should subscribe listener on mount', () => {
    renderHook(() => useEventsConsumer(mockListener));
    expect(mockSubscribe).toHaveBeenCalledWith(mockListener);
  });

  it('should unsubscribe listener on unmount', () => {
    const { unmount } = renderHook(() => useEventsConsumer(mockListener));
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledWith(mockListener);
  });

  it('should update refs when subscribe/unsubscribe change', () => {
    const newMockSubscribe = vi.fn();
    const newMockUnsubscribe = vi.fn();

    const { rerender, unmount } = renderHook(() => useEventsConsumer(mockListener));

    vi.mocked(useEventsProvider).mockReturnValue({
      subscribe: newMockSubscribe,
      unsubscribe: newMockUnsubscribe,
    } as unknown as IEventsProviderContext);

    rerender();

    // Unmount to test if new unsubscribe is called
    unmount();

    expect(newMockUnsubscribe).toHaveBeenCalledWith(mockListener);
    expect(mockUnsubscribe).not.toHaveBeenCalled();
  });
});
