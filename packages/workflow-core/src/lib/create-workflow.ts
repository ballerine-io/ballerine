import { TCreateWorkflow } from './types';
import { WorkflowRunner } from './workflow-runner';

export const createWorkflow: TCreateWorkflow = ({
  definition,
  workflowActions,
  workflowContext,
  extensions,
  runtimeId,
  invokeChildWorkflowAction,
}) =>
  new WorkflowRunner({
    definition,
    workflowActions,
    workflowContext,
    runtimeId,
    extensions,
    invokeChildWorkflowAction
  });
