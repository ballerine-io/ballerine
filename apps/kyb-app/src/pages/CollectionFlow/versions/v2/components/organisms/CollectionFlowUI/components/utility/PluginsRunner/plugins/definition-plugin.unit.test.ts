import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { describe, expect, it, vi } from 'vitest';
import { DEFINITION_PLUGIN_NAME, definitionPlugin } from './definition-plugin';

describe('definitionPlugin', () => {
  it('should invoke plugin with provided plugin name and return context', async () => {
    // Arrange
    const mockContext = { foo: 'bar' };
    const mockInvokePlugin = vi.fn();
    const mockApp = {
      api: {
        invokePlugin: mockInvokePlugin,
      },
    };
    const pluginParams = {
      pluginName: 'testPlugin',
    };

    // Act
    const result = await definitionPlugin(
      mockContext,
      mockApp as unknown as { api: StateMachineAPI },
      pluginParams,
    );

    // Assert
    expect(mockInvokePlugin).toHaveBeenCalledWith(pluginParams.pluginName);
    expect(result).toBe(mockContext);
  });

  it('should export correct plugin name constant', () => {
    expect(DEFINITION_PLUGIN_NAME).toBe('definitionPlugin');
  });
});
