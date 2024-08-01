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
  secretsManager,
  invokeWorkflowTokenAction,
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
    secretsManager,
    invokeWorkflowTokenAction,
  });
