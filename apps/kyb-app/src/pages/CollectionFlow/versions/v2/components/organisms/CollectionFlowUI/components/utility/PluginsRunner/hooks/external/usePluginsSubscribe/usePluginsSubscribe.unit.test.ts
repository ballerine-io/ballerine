import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePlugins } from '../usePlugins/usePlugins';
import { usePluginsSubscribe } from './usePluginsSubscribe';

vi.mock('../usePlugins/usePlugins', () => ({
  usePlugins: vi.fn(),
}));

describe('usePluginsSubscribe', () => {
  const mockAddListener = vi.fn();
  const mockRemoveListener = vi.fn();
  const mockListener = vi.fn();

  beforeEach(() => {
    vi.mocked(usePlugins).mockReturnValue({
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add listener on mount', () => {
    renderHook(() => usePluginsSubscribe(mockListener));

    expect(mockAddListener).toHaveBeenCalledWith(mockListener);
    expect(mockAddListener).toHaveBeenCalledTimes(1);
  });

  it('should remove listener on unmount', () => {
    const { unmount } = renderHook(() => usePluginsSubscribe(mockListener));

    unmount();

    expect(mockRemoveListener).toHaveBeenCalledWith(mockListener);
    expect(mockRemoveListener).toHaveBeenCalledTimes(1);
  });

  it('should not add listener multiple times when dependencies change', () => {
    const { rerender } = renderHook(() => usePluginsSubscribe(mockListener));

    rerender();

    expect(mockAddListener).toHaveBeenCalledTimes(1);
  });
});
