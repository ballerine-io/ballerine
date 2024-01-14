import { TFilter } from '@/domains/filters/fetchers';

export const selectWorkflowDefinitionId = (filter: TFilter | null) => {
  if (!filter) return null;

  // TO DO: Find better place to aquire workflowDefinitionId
  return filter?.query?.where?.workflowDefinitionId?.in[0] ?? null;
};
