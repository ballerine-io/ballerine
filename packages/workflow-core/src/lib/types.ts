import type { MachineConfig, MachineOptions } from 'xstate';
import type { CommonPlugins, HttpPlugins, StatePlugins } from './plugins/types';
import type {
  IDispatchEventPluginParams,
  ISerializableChildPluginParams,
  ISerializableHttpPluginParams,
} from './plugins/external-plugin/types';
import type {
  ChildWorkflowPluginParams,
  ISerializableCommonPluginParams,
  ISerializableMappingPluginParams,
} from './plugins/common-plugin/types';
import type { TContext } from './utils';
import type { ChildCallabackable } from './workflow-runner';
import type { THelperFormatingLogic } from './utils/context-transformers/types';
import type { AnyRecord } from '@ballerine/common';
import type { DispatchEventPlugin } from './plugins/external-plugin/dispatch-event-plugin';

export type ObjectValues<TObject extends Record<any, any>> = TObject[keyof TObject];

export interface Workflow {
  subscribe: (eventName: string, callback: (event: WorkflowEvent) => Promise<void>) => void;
  sendEvent: (event: WorkflowEventWithoutState) => Promise<void>;
  getSnapshot: () => Record<PropertyKey, any>;
  invokePlugin: (pluginName: string) => Promise<void>;
  overrideContext: (context: any) => any;
}

export interface WorkflowEvent {
  type: string;
  state: string;
  error?: unknown;
  payload?: Record<PropertyKey, unknown>;
}

export interface WorkflowExtensions {
  statePlugins?: StatePlugins;
  dispatchEventPlugins?: DispatchEventPlugin[] | IDispatchEventPluginParams[];
  apiPlugins?: HttpPlugins | ISerializableHttpPluginParams[];
  commonPlugins?:
    | CommonPlugins
    | ISerializableCommonPluginParams[]
    | ISerializableMappingPluginParams[];
  childWorkflowPlugins?: ISerializableChildPluginParams[];
}

export interface ChildWorkflowCallback {
  transformers?: SerializableTransformer[];
  action: 'append';
  persistenceStates?: string[];
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

export type TNotionTableRiskCalculation = {
  notionTableId: string;
};

export type RiskCalculationInput = TNotionTableRiskCalculation;

export type SerializableTransformer = {
  transformer: string;
  mapping: string | THelperFormatingLogic;
  options: any;
};

export const WorkflowEvents = {
  STATE_UPDATE: 'STATE_UPDATE',
  STATUS_UPDATE: 'STATUS_UPDATE',
  EVALUATION_ERROR: 'EVALUATION_ERROR',
} as const;
