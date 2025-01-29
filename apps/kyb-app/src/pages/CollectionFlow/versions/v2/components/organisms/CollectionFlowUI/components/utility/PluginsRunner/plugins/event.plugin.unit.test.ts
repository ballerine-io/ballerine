import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { describe, expect, it, vi } from 'vitest';
import { EVENT_PLUGIN_NAME, eventPlugin } from './event.plugin';

describe('eventPlugin', () => {
  const mockContext = { someData: 'test' };
  const mockApi = {
    sendEvent: vi.fn(),
  };
  const mockApp = {
    api: mockApi as unknown as StateMachineAPI,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call api.sendEvent with the provided eventName', async () => {
    const pluginParams = {
      eventName: 'NEXT' as const,
    };

    await eventPlugin(mockContext, mockApp, pluginParams);

    expect(mockApi.sendEvent).toHaveBeenCalledTimes(1);
    expect(mockApi.sendEvent).toHaveBeenCalledWith('NEXT');
  });

  it('should return the unchanged context', async () => {
    const pluginParams = {
      eventName: 'PREV' as const,
    };

    const result = await eventPlugin(mockContext, mockApp, pluginParams);

    expect(result).toBe(mockContext);
  });

  it('should work with both NEXT and PREV event names', async () => {
    const events = ['NEXT', 'PREV'] as const;

    for (const eventName of events) {
      await eventPlugin(mockContext, mockApp, { eventName });
      expect(mockApi.sendEvent).toHaveBeenCalledWith(eventName);
    }

    expect(mockApi.sendEvent).toHaveBeenCalledTimes(2);
  });

  it('should be defined', () => {
    expect(EVENT_PLUGIN_NAME).toBeDefined();
  });
});
