import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowById, fetchWorkflows } from './fetchers';

export const workflowsQueryKeys = createQueryKeys('workflows', {
  list: ({
    sortBy,
    sortDir,
    page,
    limit,
    ...params
  }: {
    filterId: string;
    sortBy: string;
    sortDir: string;
    page: number;
    limit: number;
  }) => {
    const data = {
      ...params,
      orderBy: `${sortBy}:${sortDir}`,
      page: {
        number: Number(page),
        size: Number(limit),
      },
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
