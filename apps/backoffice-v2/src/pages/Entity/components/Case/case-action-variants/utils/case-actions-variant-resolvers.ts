import { TWorkflowById } from '@/domains/workflows/fetchers';

export const checkIfPdfResivisionCaseActions = (workflow: TWorkflowById) =>
  workflow?.workflowDefinition?.name === 'tld_check';
