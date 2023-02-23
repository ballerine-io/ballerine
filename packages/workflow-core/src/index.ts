import {MachineConfig, MachineOptions} from 'xstate';
import { WorkflowRunner } from './lib/statecharts';

export * from './lib/statecharts';

type Workflow = InstanceType<typeof WorkflowRunner>;

export interface WorkflowContext {
  id: string;
  state: any;
  localContextData: any;
  sessionData: any;
  lockKey: string;
}

interface WorkflowPlugin {
  when: 'pre' | 'post';
  action: (options: {
    context: any;
    event: any;
    currentState: any;
  }) => Promise<void>;
}

interface StatePlugin extends Omit<WorkflowPlugin, 'when'> {
  /**
   * The actions key to inject an action function into.
   * E.g. { actions: { [plugin.name]: plugin.action  } }
   */
  name: string;
  /**
   * entry - fire an action when transitioning into a specified state
   * exit  - fire an action when transitioning out of a specified state
   */
  when: 'entry' | 'exit';
  /**
   * States already defined in the statechart
   */
  stateNames: Array<string>;
}

interface GlobalPlugin extends WorkflowPlugin {
  stateName: string;
}

export interface WorkflowEvent {
  type: string;
  state: string;
  payload?: Record<PropertyKey, any>;
  error?: unknown;
}

export type WorkflowEventWithoutState = Omit<WorkflowEvent, 'state'>;

type StatePlugins = StatePlugin[];
type GlobalPlugins = GlobalPlugin[];

export interface WorkflowExtensions {
  statePlugins: StatePlugins;
  globalPlugins: GlobalPlugins;
}

export interface WorkflowOptions {
  workflowDefinitionType: 'statechart-json' | 'bpmn-json';
  workflowDefinition: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  context?: WorkflowContext;
  extensions?: WorkflowExtensions;
}

type TCreateWorkflow = (options: WorkflowOptions) => Workflow;

export const createWorkflow: TCreateWorkflow = ({
  workflowDefinition,
  workflowActions,
  extensions,
}) =>
  new WorkflowRunner({
    workflowDefinition,
    workflowActions,
    context: {},
    extensions,
  });
export {HttpError} from "./lib/errors";
