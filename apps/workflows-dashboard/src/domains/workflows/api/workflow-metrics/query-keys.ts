import {
  fetchCasesPerStatusStats,
  fetchWorkflowAgentCasesStats,
  fetchWorkflowStats,
} from '@app/domains/workflows/api/workflow-metrics/workflow-metrics.api';
import {
  GetAgentCasesStatsDto,
  GetCasesPerStatusDto,
} from '@app/domains/workflows/api/workflow-metrics/workflow-metrics.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowMetricsKeys = createQueryKeys('workflow-metrics', {
  workflowRuntimeStats: () => ({
    queryKey: [{}],
    queryFn: () => fetchWorkflowStats(),
  }),
  workflowAgentCasesStats: (query: GetAgentCasesStatsDto) => ({
    queryKey: [query],
    queryFn: () => fetchWorkflowAgentCasesStats(query),
  }),
  workflowCasesPerStatusStats: (query: GetCasesPerStatusDto) => ({
    queryKey: [query],
    queryFn: () => fetchCasesPerStatusStats(query),
  }),
});
