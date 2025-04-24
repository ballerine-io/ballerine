import { TPluginRunner } from '../types';

export interface IDefinitionPluginParams {
  pluginName: string;
}

export const definitionPlugin: TPluginRunner<IDefinitionPluginParams> = async (
  context,
  app,
  pluginParams,
) => {
  await app.api.invokePlugin(pluginParams.pluginName);

  return context;
};

export const DEFINITION_PLUGIN_NAME = 'definitionPlugin';
