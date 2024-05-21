import { createQueryKeys } from '@lukemorales/query-key-factory';

import { fetchLatestBusinessReport, TBusinessReports } from '@/domains/business-reports/fetchers';
import { TBusinessReportType } from '@/domains/business-reports/types';

export const businessReportsQueryKey = createQueryKeys('business-reports', {
  list: ({ reportType }: { reportType: TBusinessReportType }) => ({
    queryKey: [{ reportType }],
    queryFn: () =>
      [
        {
          createdAt: '2021-10-01T00:00:00Z',
          updatedAt: '2021-10-01T00:00:00Z',
          report: {
            reportFileId: '1',
          },
          business: {
            companyName: 'ACME Corp.',
            country: 'GB',
            website: 'https://acme.com',
          },
        },
        {
          createdAt: '2021-10-01T00:00:00Z',
          updatedAt: '2021-10-01T00:00:00Z',
          report: {
            reportFileId: '2',
          },
          business: {
            companyName: 'ACME Inc.',
            country: 'IL',
            website: 'https://acme.co.il',
          },
        },
      ] satisfies TBusinessReports,
  }),
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
});
