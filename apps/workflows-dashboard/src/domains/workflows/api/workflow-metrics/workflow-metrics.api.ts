import { GetWorkflowMetricsResponse } from '@app/domains/workflows/api/workflow-metrics/workflow-metrics.types';
import { request } from '@app/lib/request';

export async function fetchWorkflowMetrics(): Promise<GetWorkflowMetricsResponse> {
  const result = await request.get<GetWorkflowMetricsResponse>('/external/workflows/metrics');

  return result.data;
}
