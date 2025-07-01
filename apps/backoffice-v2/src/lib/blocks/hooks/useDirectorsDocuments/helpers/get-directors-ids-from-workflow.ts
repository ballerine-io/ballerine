import { safeEntityIdFilter } from '@/common/utils/safe-entity-id-filter/safe-entity-id-filter';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getDirectorsIdsFromWorkflow = (workflow: TWorkflowById) =>
  safeEntityIdFilter(
    workflow.endUsers?.filter(endUser => endUser.variant === 'director') || [],
    endUser => Boolean(endUser.id),
  ).map(endUser => endUser.id);
