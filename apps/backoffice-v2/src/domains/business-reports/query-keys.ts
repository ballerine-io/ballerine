import { createQueryKeys } from '@lukemorales/query-key-factory';

import { fetchBusinessReports } from '@/domains/business-reports/fetchers';

export const businessReportsQueryKey = createQueryKeys('business-reports', {
  latest: ({
    businessId,
    reportType,
  }: {
    businessId: string;
    reportType: 'MERCHANT_REPORT_T1' & (string & {});
  }) => ({
    queryKey: [{ businessId, reportType }],
    queryFn: () => fetchBusinessReports({ businessId, reportType }),
  }),
});
