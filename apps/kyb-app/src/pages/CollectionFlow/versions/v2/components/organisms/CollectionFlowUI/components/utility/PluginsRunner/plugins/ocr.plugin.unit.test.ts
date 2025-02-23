import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { describe, expect, it, vi } from 'vitest';
import { OCR_PLUGIN_NAME, ocrPlugin } from './ocr.plugin';

describe('ocrPlugin', () => {
  it('should invoke fetch_company_information plugin and return updated context', async () => {
    // Mock context and API
    const mockContext = {} as CollectionFlowContext;
    const mockUpdatedContext = {} as CollectionFlowContext;

    const mockApi = {
      invokePlugin: vi.fn().mockResolvedValue(undefined),
      getContext: vi.fn().mockReturnValue(mockUpdatedContext),
    };

    // Execute plugin
    const result = await ocrPlugin(mockContext, { api: mockApi as any });

    // Verify plugin was invoked
    expect(mockApi.invokePlugin).toHaveBeenCalledWith('fetch_company_information');
    expect(mockApi.invokePlugin).toHaveBeenCalledTimes(1);

    // Verify context was retrieved
    expect(mockApi.getContext).toHaveBeenCalled();
    expect(mockApi.getContext).toHaveBeenCalledTimes(1);

    // Verify returned context matches
    expect(result).toBe(mockUpdatedContext);
  });

  it('should throw error if fetch_company_information plugin fails', async () => {
    // Mock context and API with error
    const mockContext = {} as CollectionFlowContext;
    const mockError = new Error('Plugin failed');

    const mockApi = {
      invokePlugin: vi.fn().mockRejectedValue(mockError),
      getContext: vi.fn(),
    };

    // Verify plugin throws error
    await expect(ocrPlugin(mockContext, { api: mockApi as any })).rejects.toThrow(mockError);

    // Verify plugin was invoked
    expect(mockApi.invokePlugin).toHaveBeenCalledWith('fetch_company_information');
    expect(mockApi.invokePlugin).toHaveBeenCalledTimes(1);

    // Verify context was not retrieved
    expect(mockApi.getContext).not.toHaveBeenCalled();
  });

  it('should export correct plugin name constant', () => {
    expect(OCR_PLUGIN_NAME).toBe('ocr');
  });
});
