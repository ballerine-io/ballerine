import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { EventsProvierContext } from '../../../context';
import { useEventsProvider } from './useEventsProvider';

vi.mock('react', () => ({
  createContext: vi.fn(),
  useContext: vi.fn(),
}));

describe('useEventsProvider', () => {
  it('should call useContext with EventsProvierContext', () => {
    renderHook(() => useEventsProvider());
    expect(useContext).toHaveBeenCalledWith(EventsProvierContext);
  });

  it('should return context value', () => {
    const mockContextValue = {
      listeners: [],
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      run: vi.fn(),
      event: vi.fn(),
    };

    vi.mocked(useContext).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useEventsProvider());
    expect(result.current).toBe(mockContextValue);
  });
});
