import { MerchantReportType } from '@ballerine/common';
import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  fetchBusinessReportById,
  fetchBusinessReports,
  fetchLatestBusinessReport,
} from '@/domains/business-reports/fetchers';
import { TReportStatusValue, TRiskLevel } from '@/pages/MerchantMonitoring/schemas';

export const businessReportsQueryKey = createQueryKeys('business-reports', {
  list: ({
    page,
    pageSize,
    sortBy,
    sortDir,
    ...params
  }: {
    reportType?: MerchantReportType;
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: string;
    riskLevels?: TRiskLevel[];
    statuses?: TReportStatusValue[];
    findings?: string[];
    from?: string;
    to?: string;
    isAlert?: boolean;
  }) => ({
    queryKey: [{ page, pageSize, sortBy, sortDir, ...params }],
    queryFn: () => {
      const data = {
        ...params,
        ...(page && pageSize
          ? {
              page: {
                number: Number(page),
                size: Number(pageSize),
              },
            }
          : {}),
        ...(sortBy && sortDir ? { orderBy: `${sortBy}:${sortDir}` } : {}),
      };

      return fetchBusinessReports(data);
    },
  }),
  latest: ({ businessId, reportType }: { businessId: string; reportType: MerchantReportType }) => ({
    queryKey: [{ businessId, reportType }],
    queryFn: () => fetchLatestBusinessReport({ businessId, reportType }),
  }),
  byId: ({ id }: { id: string }) => ({
    queryKey: [{ id }],
    queryFn: () => fetchBusinessReportById({ id }),
  }),
});
