import type { MachineConfig, MachineOptions } from 'xstate';
import { ApiPlugins, StatePlugins } from './plugins/types';
import { IApiPluginParams } from './plugins/external-plugin/api-plugin';

export type ObjectValues<TObject extends Record<any, any>> = TObject[keyof TObject];

export interface Workflow {
  subscribe: (callback: (event: WorkflowEvent) => void) => void;
  sendEvent: (event: Omit<WorkflowEvent, 'state'>) => Promise<void>;
  getSnapshot: () => Record<PropertyKey, any>;
}

export interface WorkflowEvent {
  type: string;
  state: string;
  payload?: Record<PropertyKey, any>;
  error?: unknown;
}

export interface WorkflowExtensions {
  statePlugins?: StatePlugins;
  apiPlugins?: ApiPlugins | IApiPluginParams[];
}
export interface WorkflowContext {
  id?: string;
  state?: any;
  machineContext?: any;
  sessionData?: any;
  lockKey?: string;
}

export interface WorkflowOptions {
  definitionType: 'statechart-json' | 'bpmn-json';
  definition: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  workflowContext?: WorkflowContext;
  extensions?: WorkflowExtensions;
}

export interface WorkflowRunnerArgs {
  definition: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  workflowContext?: WorkflowContext;
  extensions?: WorkflowExtensions;
}

export type WorkflowEventWithoutState = Omit<WorkflowEvent, 'state'>;

export type TCreateWorkflow = (options: WorkflowOptions) => Workflow;

export interface CallbackInfo {
  event: string;
  // what data should be sent back to the parent workflow, out of the full child workflow context i.e. { user: true }
  contextToCopy: { [key: string]: boolean };
}
export interface ParentWorkflowMetadata {
  name: string;
  definitionId: string;
  runtimeId: string;
  version: number;
}
export interface ChildWorkflowMetadata {
  name: string;
  definitionId: string;
  runtimeId: string;
  version: number;
  /**
   * @description static properties to initiate the new machine with
   */
  initOptions?: {
    context: {
      [key: string]: unknown;
    };
    /**
     * @description state of the machine
     */
    state: string;
    /**
     * @description i.e. approve | reject - see the /event endpoint
     */
    event: string;
  };
}
export interface WorkflowCallbackPayload {
  parentWorkflowMetadata: ParentWorkflowMetadata;
  childWorkflowMetadata: ChildWorkflowMetadata;
  callbackInfo: CallbackInfo;
}

export interface WorkflowClientOptions {
  onEvent?: (payload: WorkflowCallbackPayload) => Promise<void>;
  onInvokeChildWorkflow?: (payload: WorkflowCallbackPayload) => Promise<void>;
}

export const Error = {
  ERROR: 'ERROR',
  HTTP_ERROR: 'HTTP_ERROR',
} as const;

export const Errors = [Error.ERROR, Error.HTTP_ERROR] as const;
