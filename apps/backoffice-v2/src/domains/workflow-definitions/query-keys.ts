import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';

export const workflowDefinitionsQueryKeys = createQueryKeys('workflow-definitions', {
  byId: ({ workflowDefinitionId }: { workflowDefinitionId: string }) => ({
    queryKey: [{ workflowDefinitionId }],
    queryFn: () => fetchWorkflowDefinitionById({ workflowDefinitionId }),
  }),
});
