import type { MachineConfig, MachineOptions } from 'xstate';
import { ApiPlugins, StatePlugins } from './plugins/types';
import { SerializableValidatableTransformer } from './plugins';
import { ISerializableApiPluginParams } from './plugins/external-plugin/types';

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
  apiPlugins?: ApiPlugins | Array<ISerializableApiPluginParams>;
}
export interface WorkflowContext {
  id?: string;
  state?: any;
  machineContext?: any;
  sessionData?: any;
  lockKey?: string;
}

export interface ChildWorkflow {
  name: string;
  runtimeId: string;
  definitionId: string;
  definitionVersion: 1;
  stateNames: Array<string>;
  contextToCopy: SerializableValidatableTransformer;
  callbackInfo: CallbackInfo;
  initOptions?: {
    event?: string;
    context?: Record<string, unknown>;
    state?: string;
  };
}

export interface WorkflowOptions {
  definitionType: 'statechart-json' | 'bpmn-json';
  definition: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  workflowContext?: WorkflowContext;
  extensions?: WorkflowExtensions;
  childWorkflows?: Array<ChildWorkflow>;
  onInvokeChildWorkflow?: WorkflowClientOptions['onInvokeChildWorkflow'];
  onEvent?: WorkflowClientOptions['onEvent'];
}

export interface CallbackInfo {
  event: string;
  // what data should be sent back to the parent workflow, out of the full child workflow context
  contextToCopy: SerializableValidatableTransformer;
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
  initOptions?: Partial<{
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
  }>;
}
export interface WorkflowCallbackPayload {
  parentWorkflowMetadata: ParentWorkflowMetadata;
  childWorkflowMetadata: ChildWorkflowMetadata;
  callbackInfo: CallbackInfo;
}

export interface WorkflowClientOptions {
  onEvent?: (payload: WorkflowCallbackPayload) => Promise<void>;
  onInvokeChildWorkflow?: (childWorkflowMetadata: ChildWorkflowMetadata) => Promise<void>;
}

export interface WorkflowRunnerArgs extends WorkflowClientOptions {
  childWorkflows?: Array<ChildWorkflow>;
  definition: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  workflowContext?: WorkflowContext;
  extensions?: WorkflowExtensions;
}

export type WorkflowEventWithoutState = Omit<WorkflowEvent, 'state'>;

export type TCreateWorkflow = (options: WorkflowOptions) => Workflow;

export const Error = {
  ERROR: 'ERROR',
  HTTP_ERROR: 'HTTP_ERROR',
} as const;

export const Errors = [Error.ERROR, Error.HTTP_ERROR] as const;
