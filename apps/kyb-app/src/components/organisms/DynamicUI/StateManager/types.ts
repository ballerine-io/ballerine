import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { AnyChildren, AnyObject } from '@ballerine/ui';
import { MachineConfig } from 'xstate';

export type State = MachineConfig<AnyObject, AnyObject, any>;

export interface UIState {
  isLoading: boolean;
}

export interface StateManagerContext {
  stateApi: StateMachineAPI;
  state: string;
  payload: AnyObject;
}

export type StateManagerChildCallback = (bag: StateManagerContext) => JSX.Element;

export interface StateManagerProps {
  workflowId: string;
  definition: State;
  definitionType: string;
  extensions: AnyObject;
  children: AnyChildren | StateManagerChildCallback;
  initialContext?: CollectionFlowContext;
}
