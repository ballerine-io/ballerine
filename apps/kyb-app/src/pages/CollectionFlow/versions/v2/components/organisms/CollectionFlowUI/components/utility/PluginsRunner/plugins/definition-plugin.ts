import { TPluginRunner } from '../types';

export interface IDefinitionPluginParams {
  pluginName: string;
}

export const DEFINITION_PLUGIN_NAME = 'definitionPlugin';

export const definitionPlugin: TPluginRunner<IDefinitionPluginParams> = async (
  context,
  { api },
  pluginParams,
) => {
  await api.invokePlugin(pluginParams.pluginName);

  return context;
};
