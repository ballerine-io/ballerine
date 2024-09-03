import { SortingParams } from '@/common/types/sorting-params.types';
import { fetchWorkflows, GetWorkflowsDto } from '@/domains/workflows/api/workflow';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowKeys = createQueryKeys('workflows', {
  list: (query: GetWorkflowsDto, sorting: SortingParams) => ({
    queryKey: [{ query, sorting }],
    queryFn: () => fetchWorkflows(query, sorting),
  }),
});
