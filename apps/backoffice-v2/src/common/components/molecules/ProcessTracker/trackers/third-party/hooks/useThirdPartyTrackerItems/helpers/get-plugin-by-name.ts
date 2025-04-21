import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getPluginByName = (
  pluginName: string,
  pluginsOutput: TWorkflowById['context']['pluginsOutput'],
) => {
  let plugin: NonNullable<TWorkflowById['context']['pluginsOutput']>[string];

  Object.keys(pluginsOutput ?? {})?.forEach(key => {
    if (pluginsOutput?.[key]?.name !== pluginName) {
      return;
    }

    plugin = pluginsOutput?.[key];
  });

  return plugin;
};
