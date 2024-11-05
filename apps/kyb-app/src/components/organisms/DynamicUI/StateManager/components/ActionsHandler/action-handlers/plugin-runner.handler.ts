import { ActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action, BaseActionParams } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';

export interface PluginRunnerParams extends BaseActionParams {
  pluginName: string;
}

export class PluginRunnerHandler implements ActionHandler {
  readonly ACTION_TYPE = 'definitionPlugin';

  async run(_: CollectionFlowContext, action: Action<PluginRunnerParams>, api: StateMachineAPI) {
    await api.invokePlugin(action.params.pluginName);
    return api.getContext();
  }
}
