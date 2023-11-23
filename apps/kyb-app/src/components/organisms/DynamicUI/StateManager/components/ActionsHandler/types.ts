import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@/domains/collection-flow';
import { AnyChildren } from '@ballerine/ui';

export type ActionDispatcher = (action: Action) => void;

export interface ActionsHandlerContext {
  dispatchAction: ActionDispatcher;
  actions: Action[];
}

export type ActionsHandlerRenderCallback = (context: ActionsHandlerContext) => JSX.Element;

export interface ActionsHandlerProps {
  actions: Action[];
  stateApi: StateMachineAPI;
  children: AnyChildren | ActionsHandlerRenderCallback;
}
