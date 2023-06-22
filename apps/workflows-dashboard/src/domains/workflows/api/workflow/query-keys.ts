import { fetchWorkflows, GetWorkflowsDto } from '@app/domains/workflows/api/workflow';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowKeys = createQueryKeys('workflows', {
  list: (query: GetWorkflowsDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchWorkflows(query),
  }),
});
