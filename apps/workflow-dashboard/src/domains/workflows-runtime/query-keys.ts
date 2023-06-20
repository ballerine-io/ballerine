import { fetchWorkflowsRuntime } from '@app/domains/workflows-runtime/api/workflows-runtime/workflows-runtime.api';
import { GetWorkflowsRuntimeDto } from '@app/domains/workflows-runtime/api/workflows-runtime/workflows-runtime.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowsRuntimeKeys = createQueryKeys('workflows-runtime', {
  list: (query: GetWorkflowsRuntimeDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchWorkflowsRuntime(query),
  }),
});
