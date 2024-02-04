import { TWorkflowById } from '@/domains/workflows/fetchers';
import { WorkflowDefinitionVariant } from '@ballerine/common';

export const checkIfPdfResivisionCaseActions = (workflow: TWorkflowById) =>
  workflow?.workflowDefinition?.variant === WorkflowDefinitionVariant.WEBSITE_MONITORING;
