import { WorkflowContext, createWorkflow } from '@ballerine/workflow-core';

import { NodePlugin } from './plugins/node-plugin';

export interface NodeWorkflow {
  runner: ReturnType<typeof createWorkflow>;
}

export interface NodeWorkflowOptions {
  WorkflowDefType: 'statechart-json' | 'bpmn-json';
  workflowDefinition: any;
  extensions: NodePlugin[];
  context?: WorkflowContext;
}

type TCreateNodeWorkflow = (options: NodeWorkflowOptions) => NodeWorkflow;

export const createNodeWorkflow: TCreateNodeWorkflow = ({
  WorkflowDefType,
  workflowDefinition,
  context,
  extensions,
}) => {
  return {
    runner: createWorkflow({
      workflowDefinitionType: WorkflowDefType,
      workflowDefinition: workflowDefinition,
      workflowContext: context,
      extensions: { statePlugins: extensions },
    }),
  };
};
