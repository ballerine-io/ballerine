import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPlugin } from '../../../plugins.repository';
import { IPlugin } from '../../../types';
import { usePluginsRunner } from './usePluginsRunner';

// Mock dependencies
vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider');
vi.mock('../../../plugins.repository');

describe('usePluginsRunner', () => {
  const mockStateApi = {
    getContext: vi.fn(),
  };

  const mockPlugin = vi.fn();
  const testPlugin = { name: 'test-plugin' } as IPlugin;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useStateManagerContext).mockReturnValue({
      stateApi: mockStateApi,
      payload: {},
    } as any);

    vi.mocked(getPlugin).mockReturnValue(mockPlugin);
  });

  it('should initialize with empty plugin statuses', () => {
    const { result } = renderHook(() => usePluginsRunner([testPlugin]));
    expect(result.current.pluginStatuses).toEqual({});
  });

  it('should throw error when plugin is not found', async () => {
    const { result } = renderHook(() => usePluginsRunner([]));

    await expect(result.current.runPlugin(testPlugin)).rejects.toThrow('Plugin not found');
  });

  it('should update plugin status through lifecycle', async () => {
    const { result } = renderHook(() => usePluginsRunner([testPlugin]));

    await act(async () => {
      await result.current.runPlugin(testPlugin);
    });

    expect(result.current.pluginStatuses['test-plugin']).toEqual({
      name: 'test-plugin',
      status: 'completed',
    });
  });

  it('should handle plugin failure', async () => {
    vi.mocked(mockPlugin).mockRejectedValueOnce(new Error('Plugin failed'));

    const { result } = renderHook(() => usePluginsRunner([testPlugin]));

    await act(async () => {
      try {
        await result.current.runPlugin(testPlugin);
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.pluginStatuses['test-plugin']).toEqual({
      name: 'test-plugin',
      status: 'failed',
    });
  });

  it('should call plugin with correct parameters', async () => {
    const mockContext = { data: 'test' };
    vi.mocked(mockStateApi.getContext).mockReturnValue(mockContext);

    const { result } = renderHook(() => usePluginsRunner([testPlugin]));
    const pluginParams = { param: 'test' };

    await act(async () => {
      await result.current.runPlugin(testPlugin);
    });

    expect(mockPlugin).toHaveBeenCalledWith(mockContext, { api: mockStateApi }, pluginParams);
  });
});
