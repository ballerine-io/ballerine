import { IFormEventElement } from '@ballerine/ui';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlugins } from '../../components/utility/PluginsRunner/hooks/external/usePlugins';
import { IPlugin } from '../../components/utility/PluginsRunner/types';
import { usePluginRunners } from './usePluginRunners';

vi.mock('../../components/utility/PluginsRunner/hooks/external/usePlugins');

describe('usePluginRunners', () => {
  const mockRunPlugin = vi.fn();
  const mockedUsePlugins = vi.mocked(usePlugins);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockedUsePlugins.mockReturnValue({
      runPlugin: mockRunPlugin,
      plugins: [],
      pluginStatuses: {},
      addListener: vi.fn(),
      removeListener: vi.fn(),
    });
  });

  it('should create runners from plugins', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange', elementId: 'test-id' }],
        commonParams: { debounceTime: 100 },
      },
    ];

    const { result } = renderHook(() => usePluginRunners(plugins as IPlugin[]));

    expect(result.current.runners).toHaveLength(1);
    expect(result.current.runners[0]).toMatchObject({
      name: 'test-plugin',
      runOn: plugins[0]?.runOn,
    });
  });

  it('should find plugin runner by event name and element', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange', elementId: 'test-id' }],
      },
    ];

    const { result } = renderHook(() => usePluginRunners(plugins as IPlugin[]));

    const runner = result.current.getPluginRunner('onChange', {
      id: 'test-id',
    } as IFormEventElement<any, any>);

    expect(runner).toBeDefined();
    expect(runner?.name).toBe('test-plugin');
  });

  it('should return undefined when no matching plugin runner found', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange', elementId: 'test-id' }],
      },
    ];

    const { result } = renderHook(() => usePluginRunners(plugins as IPlugin[]));

    const runner = result.current.getPluginRunner('onBlur', {
      id: 'different-id',
    } as IFormEventElement<any, any>);

    expect(runner).toBeUndefined();
  });

  it('should debounce plugin execution', () => {
    const plugins = [
      {
        name: 'test-plugin',
        runOn: [{ type: 'onChange', elementId: 'test-id' }],
        commonParams: { debounceTime: 100 },
      },
    ];

    const { result } = renderHook(() => usePluginRunners(plugins as IPlugin[]));
    const context = { someData: 'test' };

    result.current.runners[0]?.run(context);
    result.current.runners[0]?.run(context);
    result.current.runners[0]?.run(context);

    vi.advanceTimersByTime(150);

    expect(mockRunPlugin).toHaveBeenCalledTimes(1);
    expect(mockRunPlugin).toHaveBeenCalledWith('test-plugin', context);
  });
});
