import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import { z } from 'zod';

export const MetricsResponseSchema = z.object({
  riskLevelCounts: z.object({
    low: z.number(),
    medium: z.number(),
    high: z.number(),
    critical: z.number(),
  }),
  violationCounts: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      count: z.number(),
    }),
  ),
  totalActiveMerchants: z.number(),
  addedMerchantsCount: z.number(),
  removedMerchantsCount: z.number(),
});

export const fetchBusinessReportMetrics = async ({ from, to }: { from?: string; to?: string }) => {
  const queryString = qs.stringify({ from, to }, { encode: false });

  const [businessReportMetrics, error] = await apiClient({
    endpoint: `../external/business-reports/metrics?${queryString}`,
    method: Method.GET,
    schema: MetricsResponseSchema,
  });

  return handleZodError(error, businessReportMetrics);
};

export const useBusinessReportMetricsQuery = ({ from, to }: { from?: string; to?: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: ['business-report-metrics', from, to],
    queryFn: () => fetchBusinessReportMetrics({ from, to }),
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
};
