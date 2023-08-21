import { GetWofklowDto } from '@app/domains/workflows/types';
import { fetchWorkflow } from '@app/domains/workflows/workflows.api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowsQueryKeys = createQueryKeys('workflows', {
  get: (query: GetWofklowDto) => ({ queryKey: [{ query }], queryFn: () => fetchWorkflow(query) }),
});
