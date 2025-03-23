import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePlugins } from '../../components/utility/PluginsRunner/hooks/external/usePlugins';
import { IPlugin } from '../../components/utility/PluginsRunner/types';
import { usePluginRunners } from './usePluginRunners';

vi.mock('../../components/utility/PluginsRunner/hooks/external/usePlugins');

describe('usePluginRunners', () => {
  const mockRunPlugin = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(usePlugins).mockReturnValue({
      runPlugin: mockRunPlugin,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should return runners and getPluginRunner', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange', elementId: 'test-id' }],
        commonParams: { debounceTime: 100 },
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    expect(result.current.runners).toHaveLength(1);
    expect(result.current.runners[0]?.name).toBe('test-plugin');
    expect(typeof result.current.runners[0]?.run).toBe('function');
    expect(typeof result.current.getPluginRunner).toBe('function');
  });

  it('should find plugin runner by event name and element', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange', elementId: 'test-id' }],
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    const runners = result.current.getPluginRunner('onChange', {
      id: 'test-id',
      element: {
        id: 'test-id',
      },
    } as any);
    expect(runners[0]?.name).toBe('test-plugin');
  });

  it('should find plugin runner by event name only', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onSubmit' }],
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    const runners = result.current.getPluginRunner('onSubmit');
    expect(runners[0]?.name).toBe('test-plugin');
  });

  it('should return empty array when no matching plugin runner found', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange', elementId: 'test-id' }],
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    const runners = result.current.getPluginRunner('onSubmit');
    expect(runners).toHaveLength(0);
  });

  it('should debounce plugin execution', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange' }],
        commonParams: { debounceTime: 100 },
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    const context = { testData: 'test' };
    result.current.runners[0]?.run?.(context);
    result.current.runners[0]?.run?.(context);

    expect(mockRunPlugin).not.toHaveBeenCalled();

    vi.advanceTimersByTime(150);

    expect(mockRunPlugin).toHaveBeenCalledTimes(1);
  });

  it('should run plugin immediately when debounceTime is not set', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange' }],
        // No debounceTime specified
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    const context = { testData: 'test' };
    result.current.runners[0]?.run?.(context);

    expect(mockRunPlugin).toHaveBeenCalledTimes(1);
    expect(mockRunPlugin).toHaveBeenCalledWith(plugins[0], context);
  });

  it('should run plugin immediately when debounceTime is 0', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange' }],
        commonParams: { debounceTime: 0 },
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    const context = { testData: 'test' };
    result.current.runners[0]?.run?.(context);

    expect(mockRunPlugin).toHaveBeenCalledTimes(1);
    expect(mockRunPlugin).toHaveBeenCalledWith(plugins[0], context);
  });

  it('should run plugin immediately when commonParams is undefined', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange' }],
        commonParams: undefined,
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    const context = { testData: 'test' };
    result.current.runners[0]?.run?.(context);

    expect(mockRunPlugin).toHaveBeenCalledTimes(1);
    expect(mockRunPlugin).toHaveBeenCalledWith(plugins[0], context);
  });

  it('should run plugin multiple times immediately when debounceTime is not set', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange' }],
        // No debounceTime
      },
    ] as IPlugin[];

    const { result } = renderHook(() => usePluginRunners(plugins));

    const context1 = { testData: 'test1' };
    const context2 = { testData: 'test2' };

    result.current.runners[0]?.run?.(context1);
    result.current.runners[0]?.run?.(context2);

    expect(mockRunPlugin).toHaveBeenCalledTimes(2);
    expect(mockRunPlugin).toHaveBeenNthCalledWith(1, plugins[0], context1);
    expect(mockRunPlugin).toHaveBeenNthCalledWith(2, plugins[0], context2);
  });
});
