import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { IFormEventElement } from '@ballerine/ui';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlugins } from '../../components/utility/PluginsRunner/hooks/external/usePlugins';
import { IPlugin } from '../../components/utility/PluginsRunner/types';
import { checkIfPluginCanRun } from './helpers';
import { usePluginRunners } from './usePluginRunners';
import { usePluginsHandler } from './usePluginsHandler';

vi.mock('../../components/utility/PluginsRunner/hooks/external/usePlugins');
vi.mock('./usePluginRunners');
vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider');
vi.mock('./helpers');

describe('usePluginsHandler', () => {
  const mockPlugins = [{ name: 'test-plugin', runOn: [], params: {} }] as IPlugin[];
  const mockGetPluginRunner = vi.fn();
  const mockGetContext = vi.fn();
  const mockRunPlugin = vi.fn();

  const mockedUsePlugins = vi.mocked(usePlugins);
  const mockedUsePluginRunners = vi.mocked(usePluginRunners);
  const mockedUseStateManagerContext = vi.mocked(useStateManagerContext);
  const mockedCheckIfPluginCanRun = vi.mocked(checkIfPluginCanRun);

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUsePlugins.mockReturnValue({
      plugins: mockPlugins,
      runPlugin: vi.fn(),
      pluginStatuses: {},
      addListener: vi.fn(),
      removeListener: vi.fn(),
    });

    mockedUsePluginRunners.mockReturnValue({
      getPluginRunner: mockGetPluginRunner,
      runners: [],
    });

    mockedUseStateManagerContext.mockReturnValue({
      stateApi: {
        getContext: mockGetContext,
      },
    } as any);

    mockGetContext.mockReturnValue({ someContext: 'value' });
  });

  it('should not run plugin when no matching runners found', () => {
    const { result } = renderHook(() => usePluginsHandler());
    mockGetPluginRunner.mockReturnValue([]);

    result.current.handleEvent('onChange', { id: 'test' } as IFormEventElement<any, any>);

    expect(mockGetPluginRunner).toHaveBeenCalledWith('onChange', { id: 'test' });
    expect(mockRunPlugin).not.toHaveBeenCalled();
  });

  it('should not run plugin when checkIfPluginCanRun returns false', () => {
    const mockRunner = {
      name: 'test-plugin',
      run: mockRunPlugin,
      runOn: [{ type: 'onChange' }],
    };

    const { result } = renderHook(() => usePluginsHandler());
    mockGetPluginRunner.mockReturnValue([mockRunner]);
    mockedCheckIfPluginCanRun.mockReturnValue(false);

    result.current.handleEvent('onChange', { id: 'test' } as IFormEventElement<any, any>);

    expect(mockRunPlugin).not.toHaveBeenCalled();
  });

  it('should run plugin when all conditions are met', () => {
    const mockRunner = {
      name: 'test-plugin',
      run: mockRunPlugin,
      runOn: [{ type: 'onChange' }],
    };
    const context = { someContext: 'value' };

    const { result } = renderHook(() => usePluginsHandler());
    mockGetPluginRunner.mockReturnValue([mockRunner]);
    mockedCheckIfPluginCanRun.mockReturnValue(true);

    result.current.handleEvent('onChange', { id: 'test' } as IFormEventElement<any, any>);

    expect(mockGetPluginRunner).toHaveBeenCalledWith('onChange', { id: 'test' });
    expect(mockedCheckIfPluginCanRun).toHaveBeenCalledWith(mockRunner.runOn, 'onChange', context);
    expect(mockRunPlugin).toHaveBeenCalledWith(context);
  });
});
