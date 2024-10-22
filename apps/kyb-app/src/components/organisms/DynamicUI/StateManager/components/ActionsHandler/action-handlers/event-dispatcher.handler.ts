import { ActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action, BaseActionParams } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';

export interface EventDispatcherParams extends BaseActionParams {
  eventName: string;
}

export class EventDispatcherHandler implements ActionHandler {
  readonly ACTION_TYPE = 'definitionEvent';

  async run(_: CollectionFlowContext, action: Action<EventDispatcherParams>, api: StateMachineAPI) {
    const { eventName } = action.params;

    await api.sendEvent(eventName);

    return api.getContext();
  }
}
