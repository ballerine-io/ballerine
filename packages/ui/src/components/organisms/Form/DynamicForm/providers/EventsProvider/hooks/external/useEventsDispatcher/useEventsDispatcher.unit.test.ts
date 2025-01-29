import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IEventsProviderContext } from '../../../types';
import { useEventsProvider } from '../../internal/useEventsProvider';
import { useEventsDispatcher } from './useEventsDispatcher';

vi.mock('../../internal/useEventsProvider', () => ({
  useEventsProvider: vi.fn(),
}));

describe('useEventsDispatcher', () => {
  const mockEvent = vi.fn();

  beforeEach(() => {
    vi.mocked(useEventsProvider).mockReturnValue({
      event: mockEvent,
    } as unknown as IEventsProviderContext);
  });

  it('should return event from useEventsProvider', () => {
    const { result } = renderHook(() => useEventsDispatcher());

    expect(result.current).toBe(mockEvent);
  });

  it('should call useEventsProvider', () => {
    renderHook(() => useEventsDispatcher());

    expect(useEventsProvider).toHaveBeenCalled();
  });
});
