import { DEFINITION_PLUGIN_NAME, definitionPlugin } from './plugins/definition-plugin';
import { EVENT_PLUGIN_NAME, eventPlugin } from './plugins/event.plugin';
import { OCR_PLUGIN_NAME, ocrPlugin } from './plugins/ocr.plugin';
import { TRANSFORMER_PLUGIN_NAME, transformerPlugin } from './plugins/transformer.plugin';

export const pluginsRepository = {
  [EVENT_PLUGIN_NAME]: eventPlugin,
  [OCR_PLUGIN_NAME]: ocrPlugin,
  [TRANSFORMER_PLUGIN_NAME]: transformerPlugin,
  [DEFINITION_PLUGIN_NAME]: definitionPlugin,
};

export const getPlugin = (pluginName: string) => {
  const plugin = pluginsRepository[pluginName as keyof typeof pluginsRepository];

  if (!plugin) {
    throw new Error(`Plugin ${pluginName} not found`);
  }

  return plugin;
};
