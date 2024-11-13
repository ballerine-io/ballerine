import { TFilter } from '@/domains/filters/fetchers';

export const selectWorkflowDefinitionId = (filter: TFilter) => {
  if (!filter) return;

  if (typeof filter?.query?.where?.workflowDefinitionId === 'string') {
    return filter?.query?.where?.workflowDefinitionId;
  }

  // TODO: Find better place to acquire workflowDefinitionId
  return filter?.query?.where?.workflowDefinitionId?.in?.[0];
};
