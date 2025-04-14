import { DEFINITION_PLUGIN_NAME, definitionPlugin } from './plugins/definition-plugin';
import { EVENT_PLUGIN_NAME, eventPlugin } from './plugins/event.plugin';
import { OCR_PLUGIN_NAME, ocrPlugin } from './plugins/ocr.plugin';
import { SYNC_PLUGIN_NAME, syncPlugin } from './plugins/sync-plugin';
import { TRANSFORMER_PLUGIN_NAME, transformerPlugin } from './plugins/transformer.plugin';
import {
  UPDATE_END_USER_PLUGIN_NAME,
  updateEndUserPlugin,
} from '@/pages/CollectionFlow/versions/v2/components/organisms/CollectionFlowUI/components/utility/PluginsRunner/plugins/update-end-user.plugin';
import {
  FETCH_COMPANY_INFORMATION_PLUGIN_NAME,
  fetchCompanyInformationPlugin,
} from '@/pages/CollectionFlow/versions/v2/components/organisms/CollectionFlowUI/components/utility/PluginsRunner/plugins/fetch-company-information.plugin';

export const pluginsRepository = {
  [EVENT_PLUGIN_NAME]: eventPlugin,
  [OCR_PLUGIN_NAME]: ocrPlugin,
  [TRANSFORMER_PLUGIN_NAME]: transformerPlugin,
  [DEFINITION_PLUGIN_NAME]: definitionPlugin,
  [SYNC_PLUGIN_NAME]: syncPlugin,
  [UPDATE_END_USER_PLUGIN_NAME]: updateEndUserPlugin,
  [FETCH_COMPANY_INFORMATION_PLUGIN_NAME]: fetchCompanyInformationPlugin,
};

export const getPlugin = (pluginName: string) => {
  const plugin = pluginsRepository[pluginName as keyof typeof pluginsRepository];

  if (!plugin) {
    throw new Error(`Plugin ${pluginName} not found`);
  }

  return plugin;
};
