import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMount } from './useMount';

describe('useMount', () => {
  it('should call callback on mount', () => {
    const mockCallback = vi.fn();
    renderHook(() => useMount(mockCallback));

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback on rerender', () => {
    const mockCallback = vi.fn();
    const { rerender } = renderHook(() => useMount(mockCallback));

    rerender();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should use latest callback reference', () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();

    const { rerender } = renderHook(({ callback }) => useMount(callback), {
      initialProps: { callback: mockCallback1 },
    });

    rerender({ callback: mockCallback2 });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).not.toHaveBeenCalled();
  });
});
