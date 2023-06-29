import { IWorkflowDefinitionStats } from '@app/domains/workflows/api/workflow-metrics/workflow-metrics.types';
import { request } from '@app/lib/request';

export async function fetchWorkflowStats(): Promise<IWorkflowDefinitionStats[]> {
  const result = await request.get<IWorkflowDefinitionStats[]>(
    '/external/workflows/metrics/workflows-definition-runtime-stats',
  );

  return result.data;
}
