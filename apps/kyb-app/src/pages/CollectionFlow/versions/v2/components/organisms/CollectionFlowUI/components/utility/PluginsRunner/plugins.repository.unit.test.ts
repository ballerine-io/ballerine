import { describe, expect, it } from 'vitest';
import { getPlugin, pluginsRepository } from './plugins.repository';
import { EVENT_PLUGIN_NAME, eventPlugin } from './plugins/event.plugin';

describe('pluginsRepository', () => {
  it('should contain the event plugin', () => {
    expect(pluginsRepository[EVENT_PLUGIN_NAME]).toBe(eventPlugin);
  });
});

describe('getPlugin', () => {
  it('should return the correct plugin when given a valid plugin name', () => {
    const plugin = getPlugin(EVENT_PLUGIN_NAME);
    expect(plugin).toBe(eventPlugin);
  });

  it('should throw an error when given an invalid plugin name', () => {
    const invalidPluginName = 'invalid-plugin';
    expect(() => getPlugin(invalidPluginName)).toThrow(`Plugin ${invalidPluginName} not found`);
  });
});
