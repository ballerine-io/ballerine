import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowLogs, fetchWorkflowLogSummary } from './fetchers';

export const workflowLogsQueryKeys = createQueryKeys('workflowLogs', {
  byWorkflowId: ({
    workflowId,
    page,
    pageSize,
    types,
    orderBy,
  }: {
    workflowId: string;
    page?: number;
    pageSize?: number;
    types?: string[];
    orderBy?: 'asc' | 'desc';
  }) => ({
    queryKey: [{ workflowId, page, pageSize, types, orderBy }],
    queryFn: () => fetchWorkflowLogs({ workflowId, page, pageSize, types, orderBy }),
  }),
  summary: ({ workflowId }: { workflowId: string }) => ({
    queryKey: [{ workflowId }],
    queryFn: () => fetchWorkflowLogSummary({ workflowId }),
  }),
});
