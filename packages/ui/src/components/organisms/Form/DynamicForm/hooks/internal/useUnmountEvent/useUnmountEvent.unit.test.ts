import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEvents } from '../useEvents';
import { useUnmount } from '../useUnmount';
import { useUnmountEvent } from './useUnmountEvent';
import { TUIElement } from '@ballerine/common';

vi.mock('../useEvents');
vi.mock('../useUnmount');

describe('useUnmountEvent', () => {
  const mockSendEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEvents).mockReturnValue({ sendEvent: mockSendEvent } as any);
    vi.mocked(useUnmount).mockImplementation(callback => callback());
  });

  it('should call useEvents with provided element', () => {
    const element = { id: 'test-id' } as TUIElement;

    renderHook(() => useUnmountEvent(element));

    expect(useEvents).toHaveBeenCalledWith(element);
  });

  it('should call sendEvent with onUnmount when unmounted', () => {
    const element = { id: 'test-id' } as TUIElement;

    renderHook(() => useUnmountEvent(element));

    expect(mockSendEvent).toHaveBeenCalledWith('onUnmount');
  });

  it('should call useUnmount with callback function', () => {
    const element = { id: 'test-id' } as TUIElement;

    renderHook(() => useUnmountEvent(element));

    expect(useUnmount).toHaveBeenCalledWith(expect.any(Function));
  });
});
