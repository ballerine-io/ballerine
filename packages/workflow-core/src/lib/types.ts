import type { MachineConfig, MachineOptions } from 'xstate';
import { StatePlugins } from './plugins/types';
import { ApiPlugin } from './plugins/external-plugin/api-plugin';
import { AnyRecord } from '@ballerine/common';

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
  statePlugins: StatePlugins;
  externalPlugins: { apiPlugins?: ApiPlugin[]; apiPluginsSchemas?: AnyRecord[] };
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

export const Error = {
  ERROR: 'ERROR',
  HTTP_ERROR: 'HTTP_ERROR',
} as const;

export const Errors = [Error.ERROR, Error.HTTP_ERROR] as const;
