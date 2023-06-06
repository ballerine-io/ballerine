import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowById, fetchWorkflows } from './fetchers';

export const workflowsQueryKeys = createQueryKeys('workflows', {
  list: (filterId: string) => ({
    queryKey: [{ filterId }],
    queryFn: () => fetchWorkflows(filterId),
  }),
  byId: ({ workflowId, filterId }: { workflowId: string; filterId: string }) => ({
    queryKey: [{ workflowId, filterId }],
    queryFn: () => fetchWorkflowById({ workflowId, filterId }),
  }),
});
