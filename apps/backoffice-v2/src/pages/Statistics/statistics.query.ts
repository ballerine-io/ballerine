import { useQuery } from '@tanstack/react-query';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const ReportsByRiskLevelSchema = z.object({
  low: z.number(),
  medium: z.number(),
  high: z.number(),
  critical: z.number(),
});

export const StatisticsOutputSchema = z.object({
  riskIndicators: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
    }),
  ),
  reports: z.object({
    all: ReportsByRiskLevelSchema,
    inProgress: ReportsByRiskLevelSchema,
    approved: ReportsByRiskLevelSchema,
  }),
});

export const fetchStatistics = async () => {
  const [statistics, error] = await apiClient({
    endpoint: `statistics`,
    method: Method.POST,
    schema: StatisticsOutputSchema,
  });

  return handleZodError(error, statistics);
};

export const useStatisticsQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => fetchStatistics(),
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
};
