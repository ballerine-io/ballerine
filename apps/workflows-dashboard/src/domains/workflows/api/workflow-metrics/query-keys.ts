import {
  fetchCasesPerStatusStats,
  fetchWorkflowStats,
} from '@/domains/workflows/api/workflow-metrics/workflow-metrics.api';
import { GetCasesPerStatusDto } from '@/domains/workflows/api/workflow-metrics/workflow-metrics.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowMetricsKeys = createQueryKeys('workflow-metrics', {
  workflowRuntimeStats: () => ({
    queryKey: [{}],
    queryFn: () => fetchWorkflowStats(),
  }),
  workflowCasesPerStatusStats: (query: GetCasesPerStatusDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchCasesPerStatusStats(query),
  }),
});
