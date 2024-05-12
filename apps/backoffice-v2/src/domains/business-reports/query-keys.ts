import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  fetchBusinessReports,
  fetchLatestBusinessReport,
} from '@/domains/business-reports/fetchers';

export const businessReportsQueryKey = createQueryKeys('business-reports', {
  latest: ({
    businessId,
    reportType,
  }: {
    businessId: string;
    reportType: 'MERCHANT_REPORT_T1' & (string & {});
  }) => ({
    queryKey: [{ businessId, reportType }],
    queryFn: () => fetchLatestBusinessReport({ businessId, reportType }),
  }),
  ongoingReportsList: ({ businessId }: { businessId: string }) => ({
    queryKey: [{ businessId, reportType: 'ONGOING_MERCHANT_REPORT_T1' }],
    queryFn: () => fetchBusinessReports({ businessId, reportType: 'ONGOING_MERCHANT_REPORT_T1' }),
  }),
});
