import { z } from 'zod';

import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import qs from 'qs';

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

export type CaseDailyStatsOutput = z.infer<typeof CaseDailyStatsOutputSchema>;
export const CaseDailyStatsOutputSchema = z.array(
  z.object({
    date: z.string(),
    count: z.number(),
  }),
);

export const fetchCaseDailyStats = async (params: { from?: string; to?: string }) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [stats, error] = await apiClient({
    endpoint: `../metrics/cases/daily?${queryParams}`,
    method: Method.GET,
    schema: CaseDailyStatsOutputSchema,
  });

  return handleZodError(error, stats);
};

export type CaseAnalyticsOutput = z.infer<typeof CaseAnalyticsOutputSchema>;
export const CaseAnalyticsOutputSchema = z.object({
  casesByStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
    }),
  ),
  ongoingCasesByRisk: z.array(
    z.object({
      riskLevel: z.string(),
      count: z.number(),
    }),
  ),
  approvedCasesByRisk: z.array(
    z.object({
      riskLevel: z.string(),
      count: z.number(),
    }),
  ),
});

export const fetchCaseAnalytics = async () => {
  const [stats, error] = await apiClient({
    endpoint: `../metrics/cases/current`,
    method: Method.GET,
    schema: CaseAnalyticsOutputSchema,
  });

  return handleZodError(error, stats);
};
