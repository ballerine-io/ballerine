import { StateMachineAPI } from '@app/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
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
}
