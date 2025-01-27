import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TPluginStatus } from '../../../context';
import { usePluginListeners } from './usePluginListeners';

describe('usePluginListeners', () => {
  it('should initialize with empty listeners array', () => {
    const { result } = renderHook(() => usePluginListeners());
    expect(result.current.listeners).toEqual([]);
  });

  it('should add listener', () => {
    const { result } = renderHook(() => usePluginListeners());
    const mockListener = vi.fn();

    act(() => {
      result.current.addListener(mockListener);
    });

    expect(result.current.listeners).toHaveLength(1);
    expect(result.current.listeners[0]).toBe(mockListener);
  });

  it('should remove listener', () => {
    const { result } = renderHook(() => usePluginListeners());
    const mockListener = vi.fn();

    act(() => {
      result.current.addListener(mockListener);
    });

    act(() => {
      result.current.removeListener(mockListener);
    });

    expect(result.current.listeners).toHaveLength(0);
  });

  it('should notify all listeners', () => {
    const { result } = renderHook(() => usePluginListeners());
    const mockListener1 = vi.fn();
    const mockListener2 = vi.fn();

    const testContext = {} as CollectionFlowContext;
    const testPluginName = 'testPlugin';
    const testParams = { foo: 'bar' };
    const testStatus: TPluginStatus = 'completed';

    act(() => {
      result.current.addListener(mockListener1);
      result.current.addListener(mockListener2);
    });

    act(() => {
      result.current.notifyListeners(testContext, testPluginName, testParams, testStatus);
    });

    expect(mockListener1).toHaveBeenCalledWith(testContext, testPluginName, testParams, testStatus);
    expect(mockListener2).toHaveBeenCalledWith(testContext, testPluginName, testParams, testStatus);
    expect(mockListener1).toHaveBeenCalledTimes(1);
    expect(mockListener2).toHaveBeenCalledTimes(1);
  });

  it('should not notify removed listeners', () => {
    const { result } = renderHook(() => usePluginListeners());
    const mockListener1 = vi.fn();
    const mockListener2 = vi.fn();

    const testContext = {} as CollectionFlowContext;
    const testPluginName = 'testPlugin';
    const testParams = { foo: 'bar' };
    const testStatus: TPluginStatus = 'completed';

    act(() => {
      result.current.addListener(mockListener1);
      result.current.addListener(mockListener2);
      result.current.removeListener(mockListener1);
    });

    act(() => {
      result.current.notifyListeners(testContext, testPluginName, testParams, testStatus);
    });

    expect(mockListener1).not.toHaveBeenCalled();
    expect(mockListener2).toHaveBeenCalledWith(testContext, testPluginName, testParams, testStatus);
    expect(mockListener2).toHaveBeenCalledTimes(1);
  });
});
