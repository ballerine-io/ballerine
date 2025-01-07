import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPlugin } from '../../../plugins.repository';
import { IPlugin } from '../../../types';
import { usePluginListeners } from './usePluginListeners';
import { usePluginsRunner } from './usePluginsRunner';

// Mock dependencies
vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider');
vi.mock('../../../plugins.repository');
vi.mock('./usePluginListeners');

describe('usePluginsRunner', () => {
  const mockStateApi = {
    getContext: vi.fn(),
  };

  const mockPlugin = vi.fn();
  const mockNotifyListeners = vi.fn();
  const testPlugin = { name: 'test-plugin', params: { param: 'test' } } as IPlugin;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useStateManagerContext).mockReturnValue({
      stateApi: mockStateApi,
      payload: {},
    } as any);

    vi.mocked(getPlugin).mockReturnValue(mockPlugin);
    vi.mocked(usePluginListeners).mockReturnValue({
      notifyListeners: mockNotifyListeners,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      listeners: [],
    });
  });

  it('should initialize with empty plugin statuses', () => {
    const { result } = renderHook(() => usePluginsRunner([testPlugin]));
    expect(result.current.pluginStatuses).toEqual({});
  });

  it('should throw error when plugin is not found', async () => {
    const { result } = renderHook(() => usePluginsRunner([]));

    await expect(result.current.runPlugin(testPlugin)).rejects.toThrow('Plugin not found');
  });

  it('should notify listeners and update plugin status through lifecycle', async () => {
    const mockContext = { data: 'test' };
    const mockResult = { data: 'result' };
    vi.mocked(mockStateApi.getContext).mockReturnValue(mockContext);
    vi.mocked(mockPlugin).mockResolvedValueOnce(mockResult);

    const { result } = renderHook(() => usePluginsRunner([testPlugin]));

    await act(async () => {
      await result.current.runPlugin(testPlugin);
    });

    // Verify status updates and notifications
    expect(mockNotifyListeners).toHaveBeenCalledTimes(2);
    expect(mockNotifyListeners).toHaveBeenNthCalledWith(
      1,
      mockContext,
      testPlugin.name,
      testPlugin.params,
      'running',
    );
    expect(mockNotifyListeners).toHaveBeenNthCalledWith(
      2,
      mockResult,
      testPlugin.name,
      testPlugin.params,
      'completed',
    );

    expect(result.current.pluginStatuses[testPlugin.name]).toEqual({
      name: testPlugin.name,
      status: 'completed',
    });
  });

  it('should notify listeners and handle plugin failure', async () => {
    const mockContext = { data: 'test' };
    vi.mocked(mockStateApi.getContext).mockReturnValue(mockContext);
    vi.mocked(mockPlugin).mockRejectedValueOnce(new Error('Plugin failed'));

    const { result } = renderHook(() => usePluginsRunner([testPlugin]));

    await act(async () => {
      try {
        await result.current.runPlugin(testPlugin);
      } catch (error) {
        // Expected error
      }
    });

    // Verify failure notifications
    expect(mockNotifyListeners).toHaveBeenCalledTimes(2);
    expect(mockNotifyListeners).toHaveBeenNthCalledWith(
      1,
      mockContext,
      testPlugin.name,
      testPlugin.params,
      'running',
    );
    expect(mockNotifyListeners).toHaveBeenNthCalledWith(
      2,
      mockContext,
      testPlugin.name,
      testPlugin.params,
      'failed',
    );

    expect(result.current.pluginStatuses[testPlugin.name]).toEqual({
      name: testPlugin.name,
      status: 'failed',
    });
  });

  it('should call plugin with correct parameters', async () => {
    const mockContext = { data: 'test' };
    vi.mocked(mockStateApi.getContext).mockReturnValue(mockContext);

    const { result } = renderHook(() => usePluginsRunner([testPlugin]));

    await act(async () => {
      await result.current.runPlugin(testPlugin);
    });

    expect(mockPlugin).toHaveBeenCalledWith(mockContext, { api: mockStateApi }, testPlugin.params);
  });
});
