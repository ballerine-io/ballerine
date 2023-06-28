import { createWorkflow, WorkflowClientOptions, WorkflowOptions } from '@ballerine/workflow-core';
import { NodePlugin } from './plugins/node-plugin';
import { WorkflowNodeSDK } from './workflow-node-sdk';

export interface WorkflowOptionsNode
  extends Pick<WorkflowOptions, 'definition' | 'definitionType' | 'workflowContext'> {
  extensions?: {
    statePlugins: Array<NodePlugin>;
  };
}

// Export from workflow-core in the future
export type TCreateWorkflowCore = typeof createWorkflow;
export type TCreateWorkflowCoreReturn = ReturnType<TCreateWorkflowCore>;

export type CreateWorkflowClient = (
  options?: WorkflowClientOptions,
) => InstanceType<typeof WorkflowNodeSDK>;
