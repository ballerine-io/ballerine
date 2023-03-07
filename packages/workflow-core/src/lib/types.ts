import type { MachineConfig, MachineOptions } from 'xstate';

export type ObjectValues<TObject extends Record<any, any>> = TObject[keyof TObject];

export interface Workflow {
  subscribe: (callback: (event: WorkflowEvent) => void) => void;
  sendEvent: (event: Omit<WorkflowEvent, 'state'>) => void;
  getSnapshot: () => Record<PropertyKey, any>;
}



export type PluginAction = { workflowId: string, context: any; event: any; state: any }

export interface WorkflowPlugin {
  when: 'pre' | 'post';
  action: (options: PluginAction) => Promise<void>;
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
  error?: unknown;
}

export interface WorkflowExtensions {
  statePlugins: StatePlugins;
  globalPlugins: GlobalPlugins;
}


export interface WorkflowContext {
  id?: string;
  state?: any;
  machineContext?: any;
  sessionData?: any;
  lockKey?: string;
}

export interface WorkflowOptions {
  workflowDefinitionType: 'statechart-json' | 'bpmn-json';
  workflowDefinition: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  workflowContext?: WorkflowContext;
  extensions?: WorkflowExtensions;
}

export interface WorkflowRunnerArgs {
  workflowDefinition: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  workflowContext?: WorkflowContext
  extensions?: WorkflowExtensions;
}

export type WorkflowEventWithoutState = Omit<WorkflowEvent, 'state'>;

export type StatePlugins = StatePlugin[];

export type GlobalPlugins = GlobalPlugin[];

export type TCreateWorkflow = (options: WorkflowOptions) => Workflow;

export const Error = {
  ERROR: 'ERROR',
  HTTP_ERROR: 'HTTP_ERROR',
} as const;

export const Errors = [Error.ERROR, Error.HTTP_ERROR] as const;
