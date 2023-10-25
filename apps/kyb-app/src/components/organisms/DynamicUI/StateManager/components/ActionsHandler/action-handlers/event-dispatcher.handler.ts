import { ActionHandler } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';
import { StateMachineAPI } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@app/domains/collection-flow';

export interface EventDispatcherParams {
  eventName: string;
}

export class EventDispatcherHandler implements ActionHandler {
  readonly ACTION_TYPE = 'definitionEvent';

  async run<TContext>(
    _: TContext,
    action: Action<EventDispatcherParams>,
    api: StateMachineAPI,
  ): Promise<TContext> {
    const { eventName } = action.params;

    await api.sendEvent(eventName);

    return api.getContext();
  }
}
