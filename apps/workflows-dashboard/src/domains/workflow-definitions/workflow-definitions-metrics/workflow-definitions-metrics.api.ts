import { IWorkflowDefinitionByVariantMetric } from '@/domains/workflow-definitions/workflow-definitions-metrics/workflow-definitions-metrics.types';
import { request } from '@/lib/request';

export const fetchWorkflowDefinitionVariantMetrics = async () => {
  const result = await request.get<IWorkflowDefinitionByVariantMetric[]>(
    `/metrics/workflow-definition/variants-metric`,
  );

  return result.data;
};
