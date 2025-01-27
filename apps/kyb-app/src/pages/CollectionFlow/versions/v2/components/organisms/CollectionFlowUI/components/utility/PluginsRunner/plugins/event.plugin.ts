import { TPluginRunner } from '../types';

export interface IEventPluginParams {
  eventName: 'NEXT' | 'PREV';
}

export const eventPlugin: TPluginRunner<IEventPluginParams> = async (
  context,
  app,
  pluginParams,
) => {
  await app.api.sendEvent(pluginParams.eventName);

  return context;
};

export const EVENT_PLUGIN_NAME = 'event';
