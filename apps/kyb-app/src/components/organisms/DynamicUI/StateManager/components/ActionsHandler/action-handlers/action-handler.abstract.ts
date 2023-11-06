import { StateMachineAPI } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@app/domains/collection-flow';

export type ActionHandlerApi = StateMachineAPI;

export abstract class ActionHandler {
  public readonly ACTION_TYPE: string;

  abstract run<TContext>(
    context: TContext,
    action: Action,
    api: ActionHandlerApi,
  ): Promise<TContext>;
}
