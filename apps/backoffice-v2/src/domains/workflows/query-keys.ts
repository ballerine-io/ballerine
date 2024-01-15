import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowById, fetchWorkflowDefinition, fetchWorkflows } from './fetchers';

export const workflowsQueryKeys = createQueryKeys('workflows', {
  list: ({
    sortBy,
    sortDir,
    page,
    pageSize,
    ...params
  }: {
    filterId: string;
    sortBy: string;
    sortDir: string;
    page: number;
    pageSize: number;
    search: string;
    filter: Record<string, unknown>;
  }) => {
    const data = {
      ...params,
      orderBy: `${sortBy}:${sortDir}`,
      page: {
        number: Number(page),
        size: Number(pageSize),
      },
    };

    return {
      queryKey: [data],
      queryFn: () => fetchWorkflows(data),
    };
  },
  workflowDefinitionById: ({ workflowDefinitionId }: { workflowDefinitionId: string }) => ({
    queryKey: [{ workflowDefinitionId }],
    queryFn: () => fetchWorkflowDefinition({ workflowDefinitionId }),
  }),
  byId: ({ workflowId, filterId }: { workflowId: string; filterId: string }) => ({
    queryKey: [{ workflowId, filterId }],
    queryFn: () => fetchWorkflowById({ workflowId, filterId }),
  }),
});
