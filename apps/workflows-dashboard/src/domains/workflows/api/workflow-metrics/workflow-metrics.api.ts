import {
  GetCasesPerStatusDto,
  ICasesPerStatusStats,
  IWorkflowDefinitionStats,
} from '@/domains/workflows/api/workflow-metrics/workflow-metrics.types';
import { request } from '@/lib/request';

export const fetchWorkflowStats = async (): Promise<IWorkflowDefinitionStats[]> => {
  const result = await request.get<IWorkflowDefinitionStats[]>(
    '/metrics/workflows/runtimes-statistic',
  );

  return result.data;
};

export const fetchCasesPerStatusStats = async (
  query: GetCasesPerStatusDto,
): Promise<ICasesPerStatusStats> => {
  const result = await request.get<ICasesPerStatusStats>(
    '/metrics/workflows/runtimes-status-count',
    { params: query },
  );

  return result.data;
};
