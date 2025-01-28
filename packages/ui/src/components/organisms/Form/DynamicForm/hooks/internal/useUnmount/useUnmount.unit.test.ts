import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useUnmount } from './useUnmount';

describe('useUnmount', () => {
  it('should call callback on unmount', () => {
    const mockCallback = vi.fn();
    const { unmount } = renderHook(() => useUnmount(mockCallback));

    expect(mockCallback).not.toHaveBeenCalled();

    unmount();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback on rerender', () => {
    const mockCallback = vi.fn();
    const { rerender } = renderHook(() => useUnmount(mockCallback));

    rerender();

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should use latest callback reference', () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();

    const { rerender, unmount } = renderHook(({ callback }) => useUnmount(callback), {
      initialProps: { callback: mockCallback1 },
    });

    rerender({ callback: mockCallback2 });
    unmount();

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });
});
