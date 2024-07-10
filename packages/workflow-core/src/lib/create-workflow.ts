import { TCreateWorkflow } from './types';
import { WorkflowRunner } from './workflow-runner';

export const createWorkflow: TCreateWorkflow = ({
  definition,
  config,
  workflowActions,
  workflowContext,
  extensions,
  runtimeId,
  invokeRiskRulesAction,
  invokeChildWorkflowAction,
}) =>
  new WorkflowRunner({
    config,
    definition,
    workflowActions,
    workflowContext,
    runtimeId,
    extensions,
    invokeRiskRulesAction,
    invokeChildWorkflowAction,
  });
