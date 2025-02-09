import { syncContext } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { getCollectionFlowState } from '@ballerine/common';
import { act, renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { updateCollectionFlowState } from '../../helpers/update-collection-flow-state';
import { useAppSync } from './useAppSync';

vi.mock('@/domains/collection-flow', () => ({
  syncContext: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('@ballerine/common', () => ({
  getCollectionFlowState: vi.fn(),
}));

vi.mock('../../helpers/update-collection-flow-state', () => ({
  updateCollectionFlowState: vi.fn(),
}));

vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider', () => ({
  useStateManagerContext: () => ({
    state: 'test-state',
  }),
}));

describe('useAppSync', () => {
  beforeEach(() => {
    vi.mocked(getCollectionFlowState).mockReturnValue({
      status: 'pending',
      currentStep: 'test-step',
    });
    vi.clearAllMocks();
  });

  it('should initialize with isSyncing false', () => {
    const { result } = renderHook(() => useAppSync());

    expect(result.current.isSyncing).toBe(false);
  });

  it('should set isSyncing to true while syncing and false after success', async () => {
    const mockContext = { someData: 'test' } as unknown as CollectionFlowContext;
    const mockedSyncContext = vi.mocked(syncContext);

    // Mock syncContext to delay resolution so we can check isSyncing state
    mockedSyncContext.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(resolve, 100);
        }),
    );

    const { result } = renderHook(() => useAppSync());

    let syncPromise: Promise<void>;

    act(() => {
      syncPromise = result.current.sync(mockContext);
    });

    expect(result.current.isSyncing).toBe(true);
    expect(updateCollectionFlowState).toHaveBeenCalledWith(mockContext, 'test-state');

    await act(async () => {
      await syncPromise;
    });

    expect(result.current.isSyncing).toBe(false);
  });

  it('should handle errors and show toast message', async () => {
    const mockContext = { someData: 'test' } as unknown as CollectionFlowContext;
    const mockError = new Error('Sync failed');
    const mockedSyncContext = vi.mocked(syncContext);
    mockedSyncContext.mockRejectedValueOnce(mockError);

    const consoleSpy = vi.spyOn(console, 'error');
    const { result } = renderHook(() => useAppSync());

    await act(async () => {
      await result.current.sync(mockContext);
    });

    expect(updateCollectionFlowState).toHaveBeenCalledWith(mockContext, 'test-state');
    expect(toast.error).toHaveBeenCalledWith('Failed to sync.');
    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    expect(result.current.isSyncing).toBe(false);
  });

  it('should return early if no collection flow state', async () => {
    const mockContext = { someData: 'test' } as unknown as CollectionFlowContext;
    vi.mocked(getCollectionFlowState).mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useAppSync());

    await act(async () => {
      await result.current.sync(mockContext);
    });

    expect(updateCollectionFlowState).not.toHaveBeenCalled();
    expect(syncContext).not.toHaveBeenCalled();
  });
});
