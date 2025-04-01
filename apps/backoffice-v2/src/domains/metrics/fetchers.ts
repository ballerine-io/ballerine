import { z } from 'zod';

import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

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
  cases: z.object({
    all: z.object({
      low: z.number(),
      medium: z.number(),
      high: z.number(),
      critical: z.number(),
    }),
    inProgress: z.object({
      low: z.number(),
      medium: z.number(),
      high: z.number(),
      critical: z.number(),
    }),
    approved: z.object({
      low: z.number(),
      medium: z.number(),
      high: z.number(),
      critical: z.number(),
    }),
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

export const fetchCaseDailyStats = async () => {
  const [stats, error] = await apiClient({
    endpoint: `../metrics/cases/daily`,
    method: Method.GET,
    schema: z.object({
      data: z.array(
        z.object({
          date: z.string(),
          count: z.number(),
        }),
      ),
    }),
  });

  return handleZodError(error, stats);
};

export const fetchCaseAnalytics = async () => {
  const [stats, error] = await apiClient({
    endpoint: `../metrics/cases/current`,
    method: Method.GET,
    schema: z.any(),
  });

  return handleZodError(error, stats);
};
