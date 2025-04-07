import { type FunctionComponent } from 'react';

import { DateRangePicker } from '@/common/components/molecules/DateRangePicker/DateRangePicker';
import { useBusinessReportMetricsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { useStatisticsLogic } from '../../hooks/useStatisticsLogic';
import { PortfolioAnalytics } from '../PortfolioAnalytics/PortfolioAnalytics';
import { PortfolioRiskStatistics } from '../PortfolioRiskStatistics/PortfolioRiskStatistics';

export const StatisticsMerchantMonitoringDashboard: FunctionComponent<{
  from: ReturnType<typeof useStatisticsLogic>['from'];
  to: ReturnType<typeof useStatisticsLogic>['to'];
  setDate: ReturnType<typeof useStatisticsLogic>['setDate'];
}> = ({ from, to, setDate }) => {
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: metricsQueryError,
  } = useBusinessReportMetricsQuery({ from, to });

  if (!metrics || isLoadingMetrics || metricsQueryError) {
    return null;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <DateRangePicker
          toDate={new Date()}
          value={{ from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined }}
          placeholder="Select a date range"
          onChange={setDate}
        />
      </div>

      <div className="flex flex-col space-y-8">
        <PortfolioAnalytics
          totalActiveMerchants={metrics.totalActiveMerchants}
          addedMerchantsCount={metrics.addedMerchantsCount}
          removedMerchantsCount={metrics.removedMerchantsCount}
        />
        <PortfolioRiskStatistics
          from={from}
          to={to}
          riskLevelCounts={metrics.riskLevelCounts}
          violationCounts={metrics.violationCounts}
        />
      </div>
    </>
  );
};
