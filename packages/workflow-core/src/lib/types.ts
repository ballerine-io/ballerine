import type {MachineConfig, MachineOptions} from "xstate";

export interface Workflow {
  subscribe: (callback: (event: WorkflowEvent) => void) => void;
  sendEvent: (event: Omit<WorkflowEvent, 'state'>) => void;
  getSnapshot: () => Record<PropertyKey, any>;
}

export interface WorkflowContext {
  id: string;
  state: any;
  localContextData: any;
  sessionData: any;
  lockKey: string;
}

export interface WorkflowPlugin {
  when: 'pre' | 'post';
  action: (options: {
    context: any;
    event: any;
    currentState: any;
  }) => Promise<void>;
}

export interface StatePlugin extends Omit<WorkflowPlugin, 'when'> {
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

export interface GlobalPlugin extends WorkflowPlugin {
  stateName: string;
}

export interface WorkflowEvent {
  type: string;
  state: string;
  payload?: Record<PropertyKey, any>;
}

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

export interface WorkflowRunnerArgs {
  workflowDefinition: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  context: any;
  state?: string;
  extensions?: WorkflowExtensions;
}

export type WorkflowEventWithoutState = Omit<WorkflowEvent, 'state'>;

export type StatePlugins = StatePlugin[];

export type GlobalPlugins = GlobalPlugin[];

export type TCreateWorkflow = (options: WorkflowOptions) => Workflow;

