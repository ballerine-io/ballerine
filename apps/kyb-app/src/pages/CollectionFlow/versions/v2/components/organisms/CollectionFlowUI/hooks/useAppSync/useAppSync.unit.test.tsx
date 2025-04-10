import { syncContext } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { getCollectionFlowState } from '@ballerine/common';
import { act, renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppSync } from './useAppSync';
import { GlobalUIState } from '../../../../providers/GlobalUIState';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <GlobalUIState>{children}</GlobalUIState>;
};

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
    const { result } = renderHook(() => useAppSync(), { wrapper: Wrapper });

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

    const { result, rerender } = renderHook(() => useAppSync(), { wrapper: Wrapper });

    let syncPromise: Promise<void>;

    act(() => {
      syncPromise = result.current.sync(mockContext);
    });

    rerender();

    expect(result.current.isSyncing).toBe(true);

    await act(async () => {
      await syncPromise;
    });

    rerender();

    expect(result.current.isSyncing).toBe(false);
  });

  it('should handle errors and show toast message', async () => {
    const mockContext = { someData: 'test' } as unknown as CollectionFlowContext;
    const mockError = new Error('Sync failed');
    const mockedSyncContext = vi.mocked(syncContext);
    mockedSyncContext.mockRejectedValueOnce(mockError);

    const consoleSpy = vi.spyOn(console, 'error');
    const { result } = renderHook(() => useAppSync(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.sync(mockContext);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to sync.');
    expect(consoleSpy).toHaveBeenCalledWith(mockError);
  });

  it('should return early if no collection flow state', async () => {
    const mockContext = { someData: 'test' } as unknown as CollectionFlowContext;
    vi.mocked(getCollectionFlowState).mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useAppSync(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.sync(mockContext);
    });

    expect(syncContext).not.toHaveBeenCalled();
  });

  it('should not update isSyncing in syncStateless', async () => {
    const mockContext = { someData: 'test' } as unknown as CollectionFlowContext;

    const { result, rerender } = renderHook(() => useAppSync(), { wrapper: Wrapper });
    let syncPromise: Promise<void>;

    expect(result.current.isSyncing).toBe(false);

    act(() => {
      syncPromise = result.current.syncStateless(mockContext);
    });

    rerender();

    expect(result.current.isSyncing).toBe(false);

    await act(async () => {
      await syncPromise;
    });

    rerender();

    expect(result.current.isSyncing).toBe(false);
    expect(syncContext).toHaveBeenCalledWith(mockContext);
  });
});
