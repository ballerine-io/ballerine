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
      // Context to copy from the parent workflow
      contextToCopy?: Object<Record <keyof <ParentMachineContext>, boolean>;
      callbackInfo: {
        event: string;
        contextToCopy: Object<Record <keyof <ChildMachineContext>, boolean>;
      };
      initOptions?: {
        // static data to initate the new machine with
        context: Object;
        state: string;
        event: string;
      }
    },
  ];
  extensions?: {
    statePlugins: Array<NodePlugin>;
  };
}

// parent constructor

// see that he should insert child workflows "actions" and inject the aciton to the relevant state
// ChildWokrflow action:
// this.?systemEmit.emit('ChildWorkflowInvoked', {....}

export type WorkflowNodeSDKParams = ConstructorParameters<typeof WorkflowNodeSDK>[0];

// Export from workflow-core in the future
export type TCreateWorkflowCore = typeof createWorkflow;
export type TCreateWorkflowCoreReturn = ReturnType<TCreateWorkflowCore>;

export type CreateWorkflow = (
  options: WorkflowNodeSDKParams,
) => InstanceType<typeof WorkflowNodeSDK>;
