import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import jsonata from 'jsonata';
import get from 'lodash/get';
import set from 'lodash/set';
import { describe, expect, it, vi } from 'vitest';
import { TRANSFORMER_PLUGIN_NAME, transformerPlugin } from './transformer.plugin';

vi.mock('jsonata');
vi.mock('lodash/get');
vi.mock('lodash/set');

describe('transformerPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should transform data according to provided expression and paths', async () => {
    // Mock context and params
    const mockContext = {
      sourceData: { name: 'Test Company' },
    } as unknown as CollectionFlowContext;

    const mockParams = {
      expression: 'name',
      input: 'sourceData',
      output: 'targetData',
    };

    const mockExpressionResult = 'Test Company';

    // Mock dependencies
    const mockJsonataInstance = {
      evaluate: vi.fn().mockResolvedValue(mockExpressionResult),
    };

    vi.mocked(jsonata).mockReturnValue(mockJsonataInstance as any);
    vi.mocked(get).mockReturnValue({ name: 'Test Company' });
    vi.mocked(set).mockReturnValue({ ...mockContext, targetData: mockExpressionResult });

    // Execute plugin
    const result = await transformerPlugin(mockContext, { api: {} as any }, mockParams);

    // Verify jsonata expression was created and evaluated
    expect(jsonata).toHaveBeenCalledWith(mockParams.expression);
    expect(mockJsonataInstance.evaluate).toHaveBeenCalledWith({ name: 'Test Company' });

    // Verify lodash get/set were called correctly
    expect(get).toHaveBeenCalledWith(mockContext, mockParams.input);
    expect(set).toHaveBeenCalledWith(mockContext, mockParams.output, mockExpressionResult);

    // Verify result contains transformed data
    expect(result).toEqual({
      sourceData: { name: 'Test Company' },
      targetData: 'Test Company',
    });
  });

  it('should use full context when input path is not provided', async () => {
    const mockContext = {
      name: 'Test Company',
    } as unknown as CollectionFlowContext;

    const mockParams = {
      expression: 'name',
      output: 'targetData',
    };

    const mockExpressionResult = 'Test Company';

    const mockJsonataInstance = {
      evaluate: vi.fn().mockResolvedValue(mockExpressionResult),
    };

    vi.mocked(jsonata).mockReturnValue(mockJsonataInstance as any);
    vi.mocked(set).mockReturnValue({ ...mockContext, targetData: mockExpressionResult });

    const result = await transformerPlugin(mockContext, { api: {} as any }, mockParams);

    expect(jsonata).toHaveBeenCalledWith(mockParams.expression);
    expect(mockJsonataInstance.evaluate).toHaveBeenCalledWith(mockContext);
    expect(get).not.toHaveBeenCalled();
    expect(set).toHaveBeenCalledWith(mockContext, mockParams.output, mockExpressionResult);

    expect(result).toEqual({
      name: 'Test Company',
      targetData: 'Test Company',
    });
  });

  it('should handle jsonata evaluation errors', async () => {
    const mockContext = {} as CollectionFlowContext;
    const mockParams = {
      expression: 'invalid[expression',
      input: 'source',
      output: 'target',
    };

    const mockError = new Error('Invalid expression');
    const mockJsonataInstance = {
      evaluate: vi.fn().mockRejectedValue(mockError),
    };

    vi.mocked(jsonata).mockReturnValue(mockJsonataInstance as any);
    vi.mocked(get).mockReturnValue({});

    await expect(transformerPlugin(mockContext, { api: {} as any }, mockParams)).rejects.toThrow(
      mockError,
    );
  });

  it('should export correct plugin name constant', () => {
    expect(TRANSFORMER_PLUGIN_NAME).toBe('transformer');
  });
});
