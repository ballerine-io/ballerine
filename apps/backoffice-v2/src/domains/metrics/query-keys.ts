import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  fetchCaseAnalytics,
  fetchCaseDailyStats,
  fetchHomeMetrics,
} from '@/domains/metrics/fetchers';

export const metricsQueryKeys = createQueryKeys('metrics', {
  home: () => ({
    queryKey: ['home'],
    queryFn: () => fetchHomeMetrics(),
  }),
  caseStats: () => ({
    queryKey: ['case-stats'],
    queryFn: () => fetchCaseAnalytics(),
  }),
  caseDailyStats: (params: { from?: string; to?: string }) => ({
    queryKey: ['case-daily', params],
    queryFn: () => fetchCaseDailyStats(params),
  }),
});
