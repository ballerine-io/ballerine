import { syncContext } from '@/domains/collection-flow';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SYNC_PLUGIN_NAME, syncPlugin } from './sync-plugin';

vi.mock('@/domains/collection-flow', () => ({
  syncContext: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('syncPlugin', () => {
  const mockContext = {
    someData: 'test',
  };

  const mockedSyncContext = vi.mocked(syncContext);
  const mockedToastError = vi.mocked(toast.error);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call syncContext with the provided context', async () => {
    await syncPlugin(mockContext, {} as any, {});

    expect(mockedSyncContext).toHaveBeenCalledTimes(1);
    expect(mockedSyncContext).toHaveBeenCalledWith(mockContext);
  });

  it('should return the original context after successful sync', async () => {
    const result = await syncPlugin(mockContext, {} as any, {});

    expect(result).toBe(mockContext);
  });

  it('should handle errors and show toast message', async () => {
    const mockError = new Error('Sync failed');
    mockedSyncContext.mockRejectedValueOnce(mockError);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await syncPlugin(mockContext, {} as any, {});

    expect(mockedToastError).toHaveBeenCalledTimes(1);
    expect(mockedToastError).toHaveBeenCalledWith('Failed to sync using plugin.');
    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    expect(result).toBe(mockContext);

    consoleSpy.mockRestore();
  });

  it('should have the correct plugin name exported', () => {
    expect(SYNC_PLUGIN_NAME).toBe('sync');
  });
});
