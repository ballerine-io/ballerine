import { type FunctionComponent } from 'react';

import type { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { useBusinessReportMetricsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { PortfolioAnalytics } from '../PortfolioAnalytics/PortfolioAnalytics';
import { PortfolioRiskStatistics } from '../PortfolioRiskStatistics/PortfolioRiskStatistics';

export const StatisticsMerchantMonitoringDashboard: FunctionComponent<{
  from: ReturnType<typeof useHomeLogic>['from'];
  to: ReturnType<typeof useHomeLogic>['to'];
  setDate: ReturnType<typeof useHomeLogic>['setDate'];
}> = ({ from, to }) => {
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: metricsQueryError,
  } = useBusinessReportMetricsQuery({ from, to });

  if (!metrics || isLoadingMetrics || metricsQueryError) {
    return null;
  }

  return (
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
  );
};
