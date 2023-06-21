import { fetchWorkflows, GetWorkflowsDto } from '@app/domains/workflows/api/workflow';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowsKeys = createQueryKeys('workflows-runtime', {
  list: (query: GetWorkflowsDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchWorkflows(query),
  }),
});
