import { IFormEventElement } from '@/components/organisms/Form/DynamicForm/hooks/internal/useEvents/types';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IEventsListener } from '../../../types';
import { useEventsPool } from './useEventsPool';

describe('useEventsPool', () => {
  const mockOnEvent = vi.fn();
  const mockElement = {
    id: 'test-id',
    valueDestination: 'test',
    formattedId: 'test-id',
    formattedValueDestination: 'test',
    element: 'test',
  } as IFormEventElement<string, any>;

  it('should initialize with empty listeners array', () => {
    const { result } = renderHook(() => useEventsPool(mockOnEvent));
    expect(result.current.listeners).toEqual([]);
  });

  it('should subscribe a new listener', () => {
    const { result } = renderHook(() => useEventsPool(mockOnEvent));
    const listener = {
      id: 'test-id',
      eventName: 'onChange',
      callback: vi.fn(),
    } as IEventsListener;

    act(() => {
      result.current.subscribe(listener);
    });

    expect(result.current.listeners).toHaveLength(1);
    expect(result.current.listeners[0]).toEqual(listener);
  });

  it('should not subscribe duplicate listener', () => {
    const { result } = renderHook(() => useEventsPool(mockOnEvent));
    const listener = {
      id: 'test-id',
      eventName: 'onChange',
      callback: vi.fn(),
    } as IEventsListener;

    act(() => {
      result.current.subscribe(listener);
      result.current.subscribe(listener);
    });

    expect(result.current.listeners).toHaveLength(1);
  });

  it('should unsubscribe a listener', () => {
    const { result } = renderHook(() => useEventsPool(mockOnEvent));
    const listener = {
      id: 'test-id',
      eventName: 'onChange',
      callback: vi.fn(),
    } as IEventsListener;

    act(() => {
      result.current.subscribe(listener);
      result.current.unsubscribe(listener);
    });

    expect(result.current.listeners).toHaveLength(0);
  });

  it('should run event for matching listeners', () => {
    const { result, rerender } = renderHook(() => useEventsPool(mockOnEvent));

    const mockElement = {
      id: 'test-id-1',
      valueDestination: 'test',
      formattedId: 'test-id-1',
      formattedValueDestination: 'test',
      element: 'test',
    } as IFormEventElement<string, any>;

    const listener1 = {
      id: 'test-id-1',
      eventName: 'onChange',
      callback: vi.fn(),
    } as IEventsListener;

    const listener2 = {
      id: 'test-id-2',
      eventName: 'onBlur',
      callback: vi.fn(),
    } as IEventsListener;

    act(() => {
      result.current.subscribe(listener1);
      result.current.subscribe(listener2);
    });

    rerender();

    act(() => {
      result.current.run('onChange', mockElement);
    });

    expect(listener1.callback).toHaveBeenCalledWith('onChange', mockElement);
    expect(listener2.callback).not.toHaveBeenCalled();
  });

  it('should trigger event and call onEvent callback', () => {
    const { result, rerender } = renderHook(() => useEventsPool(mockOnEvent));
    const listener = {
      id: 'test-id',
      eventName: 'onChange',
      callback: vi.fn(),
    } as IEventsListener;

    result.current.subscribe(listener);

    rerender();

    result.current.event('onChange', mockElement);

    expect(listener.callback).toHaveBeenCalledWith('onChange', mockElement);
    expect(mockOnEvent).toHaveBeenCalledWith('onChange', mockElement);
  });
});
