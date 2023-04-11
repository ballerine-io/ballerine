import { createWorkflow, WorkflowOptions } from '@ballerine/workflow-core';
import { NodePlugin } from './plugins/node-plugin';
import { WorkflowNodeSDK } from './workflow-node-sdk';

export interface WorkflowOptionsNode
  extends Pick<WorkflowOptions, 'definition' | 'definitionType' | 'workflowContext'> {
  childWorkflows?: [
    {
      workflowDefinitionId: string;
      workflowDefinitionVersion?: number;
      states: Array<string>;
      callbackEvent: string;
      initialContext: Object;
      // Context to copy from the parent workflow
      contextToCopy?: Object;
      // When a child workflow is done, what should be sent back to the parent workflow with the callback event 
      responseFromContext?: Object;
    },
  ];
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
