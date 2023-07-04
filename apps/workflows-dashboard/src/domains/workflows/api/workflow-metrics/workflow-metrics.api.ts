import {
  GetAgentCasesStatsDto,
  GetCasesPerStatusDto,
  IAgentCasesStats,
  ICasesPerStatusStats,
  IWorkflowDefinitionStats,
} from '@app/domains/workflows/api/workflow-metrics/workflow-metrics.types';
import { request } from '@app/lib/request';

export const fetchWorkflowStats = async (): Promise<IWorkflowDefinitionStats[]> => {
  const result = await request.get<IWorkflowDefinitionStats[]>(
    '/external/workflows/metrics/workflows-definition-runtime-stats',
  );

  return result.data;
};

export const fetchWorkflowAgentCasesStats = async (
  query: GetAgentCasesStatsDto = {},
): Promise<IAgentCasesStats[]> => {
  const result = await request.get<IAgentCasesStats[]>(
    '/external/workflows/metrics/workflow-runtime-agent-cases-stats',
    {
      params: query,
    },
  );

  return result.data;
};

export const fetchCasesPerStatusStats = async (
  query: GetCasesPerStatusDto,
): Promise<ICasesPerStatusStats> => {
  const result = await request.get<ICasesPerStatusStats>(
    '/external/workflows/metrics/workflow-runtime-cases-per-status',
    { params: query },
  );

  return result.data;
};
