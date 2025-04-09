import { type FunctionComponent } from 'react';

import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { useBusinessReportMetricsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { PortfolioAnalytics } from '../PortfolioAnalytics/PortfolioAnalytics';
import { PortfolioRiskStatistics } from '../PortfolioRiskStatistics/PortfolioRiskStatistics';
import type { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';

export const StatisticsMerchantMonitoringDashboard: FunctionComponent<{
  from: ReturnType<typeof useHomeLogic>['from'];
  to: ReturnType<typeof useHomeLogic>['to'];
  setDate: ReturnType<typeof useHomeLogic>['setDate'];
}> = ({ setDate, ...dates }) => {
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: metricsQueryError,
  } = useBusinessReportMetricsQuery(dates);

  if (!metrics || isLoadingMetrics || metricsQueryError) {
    return null;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <DateRangePicker toDate={new Date()} value={dates} onChange={setDate} />
      </div>

      <div className="flex flex-col space-y-8">
        <PortfolioAnalytics
          totalActiveMerchants={metrics.totalActiveMerchants}
          addedMerchantsCount={metrics.addedMerchantsCount}
          removedMerchantsCount={metrics.removedMerchantsCount}
        />
        <PortfolioRiskStatistics
          {...dates}
          riskLevelCounts={metrics.riskLevelCounts}
          violationCounts={metrics.violationCounts}
        />
      </div>
    </>
  );
};
