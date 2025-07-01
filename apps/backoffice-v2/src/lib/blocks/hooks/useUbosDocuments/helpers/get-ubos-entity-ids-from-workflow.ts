import { safeEntityIdFilter } from '@/common/utils/safe-entity-id-filter/safe-entity-id-filter';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getUbosEntityIdsFromWorkflow = (workflow: TWorkflowById) => {
  return safeEntityIdFilter(
    workflow.endUsers?.filter(endUser => endUser.variant === 'ubo') || [],
    endUser => Boolean(endUser.id),
  ).map(endUser => endUser.id);
};
