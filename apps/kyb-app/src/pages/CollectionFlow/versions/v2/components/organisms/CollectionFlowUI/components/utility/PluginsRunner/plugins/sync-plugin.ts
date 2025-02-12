import { syncContext } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import jsonata from 'jsonata';
import { toast } from 'sonner';
import { TPluginRunner } from '../types';

export const SYNC_PLUGIN_NAME = 'sync';

export interface ISyncPluginParams {
  transform?: string;
}

export const syncPlugin: TPluginRunner<ISyncPluginParams> = async (context, _, pluginParams) => {
  try {
    const syncPayload = pluginParams?.transform
      ? await jsonata(pluginParams.transform).evaluate(context)
      : context;

    await syncContext(syncPayload as CollectionFlowContext);
  } catch (error) {
    toast.error('Failed to sync using plugin.');
    console.error(error);
  }

  return context;
};
