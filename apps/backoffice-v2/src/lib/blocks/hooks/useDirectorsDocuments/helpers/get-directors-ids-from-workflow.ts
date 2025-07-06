import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getDirectorsIdsFromWorkflow = (workflow: TWorkflowById) =>
  workflow.endUsers?.filter(endUser => endUser.variant === 'director').map(endUser => endUser.id) ||
  [];
