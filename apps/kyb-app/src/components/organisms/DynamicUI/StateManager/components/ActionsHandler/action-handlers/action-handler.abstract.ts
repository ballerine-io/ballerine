import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';

export type ActionHandlerApi = StateMachineAPI;

export abstract class ActionHandler {
  public abstract readonly ACTION_TYPE: string;

  abstract run(
    context: CollectionFlowContext,
    action: Action,
    api: ActionHandlerApi,
  ): Promise<CollectionFlowContext>;
}
