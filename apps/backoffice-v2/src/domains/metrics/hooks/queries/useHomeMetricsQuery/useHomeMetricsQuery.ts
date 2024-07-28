import { useQuery } from '@tanstack/react-query';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';

export const ReportsByRiskLevelSchema = z.object({
  low: z.number(),
  medium: z.number(),
  high: z.number(),
  critical: z.number(),
});

export const HomeMetricsOutputSchema = z.object({
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

export const fetchHomeMetrics = async () => {
  const [homeMetrics, error] = await apiClient({
    endpoint: `../metrics/home`,
    method: Method.GET,
    schema: HomeMetricsOutputSchema,
  });

  return handleZodError(error, homeMetrics);
};

export const useHomeMetricsQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: ['metrics', 'home'],
    queryFn: () => fetchHomeMetrics(),
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
};
