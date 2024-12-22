import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  fetchBusinessReportById,
  fetchBusinessReports,
  fetchLatestBusinessReport,
} from '@/domains/business-reports/fetchers';
import { MerchantReportType } from '@/domains/business-reports/constants';
import {
  RISK_LEVELS,
  STATUS_OPTIONS,
} from '@/pages/MerchantMonitoring/hooks/useMerchantMonitoringLogic/useMerchantMonitoringLogic';

export const businessReportsQueryKey = createQueryKeys('business-reports', {
  list: ({
    page,
    pageSize,
    sortBy,
    sortDir,
    ...params
  }: {
    reportType: MerchantReportType | 'All';
    search: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDir: string;
    riskLevel: Array<(typeof RISK_LEVELS)[number]>;
    status: Array<(typeof STATUS_OPTIONS)[number]>;
    from?: string;
    to?: string;
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
  latest: ({ businessId, reportType }: { businessId: string; reportType: MerchantReportType }) => ({
    queryKey: [{ businessId, reportType }],
    queryFn: () => fetchLatestBusinessReport({ businessId, reportType }),
  }),
  byId: ({ id }: { id: string }) => ({
    queryKey: [{ id }],
    queryFn: () => fetchBusinessReportById({ id }),
  }),
});
