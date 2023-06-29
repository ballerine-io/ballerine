import { fetchWorkflowStats } from '@app/domains/workflows/api/workflow-metrics/workflow-metrics.api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowMetricsKeys = createQueryKeys('workflow-metrics', {
  workflowRuntimeStats: () => ({
    queryKey: [{}],
    queryFn: () => fetchWorkflowStats(),
  }),
});
