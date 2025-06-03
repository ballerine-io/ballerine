import { TCreateWorkflow } from './types';
import { WorkflowRunner } from './workflow-runner';

export const createWorkflow: TCreateWorkflow = ({
  definition,
  config,
  helpers,
  workflowActions,
  workflowContext,
  extensions,
  runtimeId,
  invokeRiskRulesAction,
  invokeChildWorkflowAction,
  invokeWorkflowTokenAction,
  secretsManager,
}) =>
  new WorkflowRunner({
    config,
    helpers,
    definition,
    workflowActions,
    workflowContext,
    runtimeId,
    extensions,
    invokeRiskRulesAction,
    invokeChildWorkflowAction,
    invokeWorkflowTokenAction,
    secretsManager,
  });
