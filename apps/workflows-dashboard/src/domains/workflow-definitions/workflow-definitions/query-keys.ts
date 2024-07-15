import { fetchWorkflowDefinitionsList } from '@/domains/workflow-definitions/workflow-definitions/workflow-definitions.api';
import { GetWorkflowDefinitionsListDto } from '@/domains/workflow-definitions/workflow-definitions/workflow-definitions.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowDefinitionsQueryKeys = createQueryKeys('workfloDefinitions', {
  list: (query: GetWorkflowDefinitionsListDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchWorkflowDefinitionsList(query),
  }),
});
