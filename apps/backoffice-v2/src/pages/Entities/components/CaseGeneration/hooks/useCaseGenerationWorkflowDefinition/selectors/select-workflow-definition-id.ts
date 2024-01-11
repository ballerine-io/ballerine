import { TFilter } from '@/domains/filters/types';

export const selectWorkflowDefinitionId = (obj: TFilter | null) => {
  if (!obj) return null;

  // TO DO: Find better place to aquire workflowDefinitionId
  return obj?.query?.where?.workflowDefinitionId?.in[0] ?? null;
};
