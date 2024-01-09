import type { MachineConfig, MachineOptions } from 'xstate';
import { HttpPlugins, CommonPlugins, StatePlugins } from './plugins/types';
import {
  ISerializableChildPluginParams,
  ISerializableHttpPluginParams,
} from './plugins/external-plugin/types';
import {
  ChildWorkflowPluginParams,
  ISerializableCommonPluginParams,
  ISerializableMappingPluginParams,
} from './plugins/common-plugin/types';
import { TContext } from './utils';
import { ChildCallabackable } from './workflow-runner';
import { THelperFormatingLogic } from './utils/context-transformers/types';
import { AnyRecord } from '@ballerine/common';

export type ObjectValues<TObject extends Record<any, any>> = TObject[keyof TObject];

export interface Workflow {
  subscribe: (callback: (event: WorkflowEvent) => void) => void;
  sendEvent: (event: Omit<WorkflowEvent, 'state'>) => Promise<void>;
  getSnapshot: () => Record<PropertyKey, any>;
  invokePlugin: (pluginName: string) => Promise<void>;
  overrideContext: (context: any) => any;
}

export interface WorkflowEvent {
  type: string;
  state: string;
  payload?: Record<PropertyKey, any>;
  error?: unknown;
}

export interface WorkflowExtensions {
  statePlugins?: StatePlugins;
  apiPlugins?: HttpPlugins | Array<ISerializableHttpPluginParams>;
  commonPlugins?:
    | CommonPlugins
    | Array<ISerializableCommonPluginParams>
    | Array<ISerializableMappingPluginParams>;
  childWorkflowPlugins?: Array<ISerializableChildPluginParams>;
}

export interface ChildWorkflowCallback {
  transformers?: Array<SerializableTransformer>;
  action: 'append';
  persistenceStates?: Array<string>;
  deliverEvent?: string;
}

export interface ChildToParentCallback {
  childCallbackResults?: Array<ChildWorkflowCallback & { definitionId: string }>;
}

export interface WorkflowContext {
  id?: string;
  state?: any;
  machineContext?: any;
  sessionData?: any;
  lockKey?: string;
}

export interface IUpdateContextEvent {
  type: string;
  payload: Record<PropertyKey, unknown>;
}

export interface WorkflowOptions {
  runtimeId: string;
  definitionType: 'statechart-json' | 'bpmn-json';
  definition: MachineConfig<any, any, any>;
  config?: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  workflowContext?: WorkflowContext;
  extensions?: WorkflowExtensions;
  invokeChildWorkflowAction?: ChildCallabackable['invokeChildWorkflowAction'];
}

export interface CallbackInfo {
  event: string;
}

export interface WorkflowRunnerArgs {
  runtimeId: string;
  definition: MachineConfig<any, any, any>;
  config?: MachineConfig<any, any, any>;
  workflowActions?: MachineOptions<any, any>['actions'];
  workflowContext?: WorkflowContext;
  extensions?: WorkflowExtensions;
  invokeChildWorkflowAction?: ChildWorkflowPluginParams['action'];
}

export type WorkflowEventWithoutState = Omit<WorkflowEvent, 'state'>;

export type TCreateWorkflow = (options: WorkflowOptions) => Workflow;

export const Error = {
  ERROR: 'ERROR',
  HTTP_ERROR: 'HTTP_ERROR',
} as const;

export const Errors = [Error.ERROR, Error.HTTP_ERROR] as const;

export type ChildPluginCallbackOutput = {
  parentWorkflowRuntimeId: string;
  definitionId: string;
  initOptions: {
    context: TContext;
    event?: string;
    config: AnyRecord;
  };
};

export type SerializableTransformer = {
  transformer: string;
  mapping: string | THelperFormatingLogic;
  options: any;
};
