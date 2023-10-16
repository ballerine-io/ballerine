import { StateMachineAPI } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@app/domains/collection-flow';
import { AnyChildren } from '@ballerine/ui';

export interface ActionsHandlerContext {
  dispatchAction: (action: Action) => void;
  actions: Action[];
}

export type ActionsHandlerRenderCallback = (context: ActionsHandlerContext) => JSX.Element;

export interface ActionsHandlerProps {
  actions: Action[];
  stateApi: StateMachineAPI;
  children: AnyChildren | ActionsHandlerRenderCallback;
}
