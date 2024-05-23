import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  fetchBusinessReports,
  fetchLatestBusinessReport,
  TBusinessReportType,
} from '@/domains/business-reports/fetchers';

export const businessReportsQueryKey = createQueryKeys('business-reports', {
  latest: ({
    businessId,
    reportType,
  }: {
    businessId: string;
    reportType: TBusinessReportType;
  }) => ({
    queryKey: [{ businessId, reportType }],
    queryFn: () => fetchLatestBusinessReport({ businessId, reportType }),
  }),
  list: ({ businessId, reportType }: { businessId: string; reportType: TBusinessReportType }) => ({
    queryKey: [{ businessId, reportType }],
    queryFn: () => fetchBusinessReports({ businessId, reportType }),
  }),
});
