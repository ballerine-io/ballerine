import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  fetchBusinessReportById,
  fetchBusinessReports,
  fetchLatestBusinessReport,
} from '@/domains/business-reports/fetchers';
import { TBusinessReportType } from '@/domains/business-reports/types';

export const businessReportsQueryKey = createQueryKeys('business-reports', {
  list: ({
    page,
    pageSize,
    sortBy,
    sortDir,
    ...params
  }: {
    reportType: TBusinessReportType;
    search: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
  }) => ({
    queryKey: [{ page, pageSize, sortBy, sortDir, ...params }],
    queryFn: () => {
      const data = {
        ...params,
        page: {
          number: Number(page),
          size: Number(pageSize),
        },
        orderBy: `${sortBy}:${sortDir}`,
      };

      return fetchBusinessReports(data);
    },
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
  byId: ({ id }: { id: string }) => ({
    queryKey: [{ id }],
    queryFn: () => fetchBusinessReportById({ id }),
  }),
});
