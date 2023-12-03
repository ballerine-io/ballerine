import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@/domains/collection-flow';

export type ActionHandlerApi = StateMachineAPI;

export abstract class ActionHandler {
  public abstract readonly ACTION_TYPE: string;

  abstract run<TContext>(
    context: TContext,
    action: Action,
    api: ActionHandlerApi,
  ): Promise<TContext>;
}
