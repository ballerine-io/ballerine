import { TPluginRunner } from '../types';

export interface IEventPluginParams {
  eventName: 'NEXT' | 'PREV';
}

export const EVENT_PLUGIN_NAME = 'event';

export const eventPlugin: TPluginRunner<IEventPluginParams> = async (
  context,
  { api },
  pluginParams,
) => {
  await api.sendEvent(pluginParams.eventName);

  return context;
};
