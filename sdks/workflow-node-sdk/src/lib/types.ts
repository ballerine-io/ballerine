import { createWorkflow, WorkflowOptions } from '@ballerine/workflow-core';
import { NodePlugin } from './plugins/node-plugin';
import { WorkflowNodeSDK } from './workflow-node-sdk';

export interface WorkflowOptionsNode
  extends Pick<
    WorkflowOptions,
    'definition' | 'config' | 'definitionType' | 'workflowContext' | 'runtimeId'
  > {
  extensions?: {
    statePlugins: Array<NodePlugin>;
  };
}

export type WorkflowNodeSDKParams = ConstructorParameters<typeof WorkflowNodeSDK>[0];

// Export from workflow-core in the future
export type TCreateWorkflowCore = typeof createWorkflow;
export type TCreateWorkflowCoreReturn = ReturnType<TCreateWorkflowCore>;

export type CreateWorkflow = (
  options: WorkflowNodeSDKParams,
) => InstanceType<typeof WorkflowNodeSDK>;
