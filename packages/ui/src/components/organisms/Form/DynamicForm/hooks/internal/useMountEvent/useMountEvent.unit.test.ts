import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFormElement } from '../../../types';
import { useEvents } from '../useEvents';
import { useMount } from '../useMount';
import { useMountEvent } from './useMountEvent';

vi.mock('../useEvents');
vi.mock('../useMount');

describe('useMountEvent', () => {
  const mockSendEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEvents).mockReturnValue({ sendEvent: mockSendEvent } as any);
    vi.mocked(useMount).mockImplementation(callback => callback());
  });

  it('should call useEvents with provided element', () => {
    const element = { id: 'test-id' } as IFormElement;

    renderHook(() => useMountEvent(element));

    expect(useEvents).toHaveBeenCalledWith(element);
  });

  it('should call sendEvent with onMount when mounted', () => {
    const element = { id: 'test-id' } as IFormElement;

    renderHook(() => useMountEvent(element));

    expect(mockSendEvent).toHaveBeenCalledWith('onMount');
  });

  it('should call useMount with callback function', () => {
    const element = { id: 'test-id' } as IFormElement;

    renderHook(() => useMountEvent(element));

    expect(useMount).toHaveBeenCalledWith(expect.any(Function));
  });
});
