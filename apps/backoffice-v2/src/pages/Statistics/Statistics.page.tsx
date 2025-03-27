import { Loader2 } from 'lucide-react';
import { FunctionComponent } from 'react';

import { MonthPicker } from './components/MonthPicker/MonthPicker';
import { PortfolioAnalytics } from './components/PortfolioAnalytics/PortfolioAnalytics';
import { PortfolioRiskStatistics } from './components/PortfolioRiskStatistics/PortfolioRiskStatistics';
import { useStatisticsLogic } from './hooks/useStatisticsLogic';

export const Statistics: FunctionComponent = () => {
  const { metrics, isLoadingMetrics, customer, isLoadingCustomer, error, date, setDate } =
    useStatisticsLogic();

  if (error) {
    throw error;
  }

  if (isLoadingMetrics || !metrics || isLoadingCustomer || !customer) {
    return <Loader2 className="w-4 animate-spin" />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <MonthPicker date={date} setDate={setDate} />
      </div>

      {customer?.config?.isMerchantMonitoringEnabled && (
        <div className="flex flex-col space-y-8">
          <PortfolioAnalytics
            totalActiveMerchants={metrics.totalActiveMerchants}
            addedMerchantsCount={metrics.addedMerchantsCount}
            removedMerchantsCount={metrics.removedMerchantsCount}
          />
          <PortfolioRiskStatistics
            userSelectedDate={date}
            riskLevelCounts={metrics.riskLevelCounts}
            violationCounts={metrics.violationCounts}
          />
        </div>
      )}
    </div>
  );
};
