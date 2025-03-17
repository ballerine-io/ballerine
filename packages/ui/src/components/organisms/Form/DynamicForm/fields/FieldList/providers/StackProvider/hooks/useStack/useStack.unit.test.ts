import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StackProviderContext } from '../../context/stack-provider-context';
import { useStack } from './useStack';

vi.mock('react', () => ({
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe('useStack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return context from StackProviderContext', () => {
    const mockContextValue = { stack: [1, 2, 3] };
    vi.mocked(useContext).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useStack());

    expect(useContext).toHaveBeenCalledWith(StackProviderContext);
    expect(result.current).toBe(mockContextValue);
  });

  it('should return empty stack when context is empty', () => {
    const mockContextValue = { stack: [] };
    vi.mocked(useContext).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useStack());

    expect(useContext).toHaveBeenCalledWith(StackProviderContext);
    expect(result.current).toBe(mockContextValue);
  });
});
