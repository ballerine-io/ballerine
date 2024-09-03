import { fetchWorkflowDefinitionVariantMetrics } from '@/domains/workflow-definitions/workflow-definitions-metrics/workflow-definitions-metrics.api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowDefinitionMetricKeys = createQueryKeys('workflow-definitions-metrics', {
  workflowDefinitionVariantMetrics: () => ({
    queryKey: [{}],
    queryFn: () => fetchWorkflowDefinitionVariantMetrics(),
  }),
});
