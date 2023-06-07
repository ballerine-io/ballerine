import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowById, fetchWorkflows } from './fetchers';

export const workflowsQueryKeys = createQueryKeys('workflows', {
  list: ({ sortBy, sortDir, ...params }: { filterId: string; sortBy: string; sortDir: string }) => {
    const data = {
      ...params,
      orderBy: `${sortBy}:${sortDir}`,
    };
    return {
      queryKey: [data],
      queryFn: () => fetchWorkflows(data),
    };
  },
  byId: ({ workflowId, filterId }: { workflowId: string; filterId: string }) => ({
    queryKey: [{ workflowId, filterId }],
    queryFn: () => fetchWorkflowById({ workflowId, filterId }),
  }),
});
