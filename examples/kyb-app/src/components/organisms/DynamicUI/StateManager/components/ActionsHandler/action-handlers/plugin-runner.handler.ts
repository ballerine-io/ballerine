import { ActionHandler } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';
import { StateMachineAPI } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@app/domains/collection-flow';

export interface PluginRunnerParams {
  pluginName: string;
}

export class PluginRunnerHandler implements ActionHandler {
  readonly ACTION_TYPE = 'definitionPlugin';

  async run<TContext>(
    _: TContext,
    action: Action<PluginRunnerParams>,
    api: StateMachineAPI,
  ): Promise<TContext> {
    await api.invokePlugin(action.params.pluginName);
    return api.getContext();
  }
}
