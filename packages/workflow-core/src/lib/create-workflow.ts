import { TCreateWorkflow } from './types';
import { WorkflowRunner } from './workflow-runner';

export const createWorkflow: TCreateWorkflow = ({
  definition,
  workflowActions,
  workflowContext,
  extensions,
  childWorkflows,
}) =>
  new WorkflowRunner({
    definition,
    workflowActions,
    workflowContext,
    extensions,
    childWorkflows,
  });
