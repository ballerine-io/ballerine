import { TCreateWorkflow } from './types';
import { WorkflowRunner } from './workflow-runner';

export const createWorkflow: TCreateWorkflow = ({
  workflowDefinition,
  workflowActions,
  workflowContext,
  extensions
}) =>
  new WorkflowRunner({
    workflowDefinition,
    workflowActions,
    workflowContext,
    extensions,
  });
