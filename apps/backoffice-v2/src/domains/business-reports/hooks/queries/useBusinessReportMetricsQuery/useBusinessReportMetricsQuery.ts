import { useQuery } from '@tanstack/react-query';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';

export const MetricsResponseSchema = z.object({
  riskLevelCounts: z.object({
    low: z.number(),
    medium: z.number(),
    high: z.number(),
    critical: z.number(),
  }),
  violationCounts: z.record(z.string(), z.number()),
});

export const fetchBusinessReportMetrics = async () => {
  const [businessReportMetrics, error] = await apiClient({
    endpoint: `../external/business-reports/metrics`,
    method: Method.GET,
    schema: MetricsResponseSchema,
  });

  return handleZodError(error, businessReportMetrics);
};

export const useBusinessReportMetricsQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: ['business-report-metrics'],
    queryFn: () => fetchBusinessReportMetrics(),
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
};
