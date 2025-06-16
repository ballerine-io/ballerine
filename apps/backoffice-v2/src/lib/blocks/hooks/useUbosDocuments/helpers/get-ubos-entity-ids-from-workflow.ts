import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getUbosEntityIdsFromWorkflow = (workflow: TWorkflowById) => {
  return (
    workflow.endUsers?.filter(endUser => endUser.variant === 'ubo').map(endUser => endUser.id) || []
  );
};
