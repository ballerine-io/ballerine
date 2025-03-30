import { Loader2 } from 'lucide-react';
import { FunctionComponent } from 'react';

import { CaseAnalytics } from './components/CaseAnalytics/CaseAnalytics';
import { CaseGraphs } from './components/CaseGraphs/CaseGraphs';
import { MonthPicker } from './components/MonthPicker/MonthPicker';
import { PortfolioAnalytics } from './components/PortfolioAnalytics/PortfolioAnalytics';
import { PortfolioRiskStatistics } from './components/PortfolioRiskStatistics/PortfolioRiskStatistics';
import { useStatisticsLogic } from './hooks/useStatisticsLogic';

export const Statistics: FunctionComponent = () => {
  const {
    metrics,
    isLoadingMetrics,
    caseMetrics,
    isLoadingCaseMetrics,
    customer,
    isLoadingCustomer,
    error,
    date,
    setDate,
  } = useStatisticsLogic();

  if (error) {
    throw error;
  }

  if (
    isLoadingMetrics ||
    !metrics ||
    isLoadingCustomer ||
    !customer ||
    isLoadingCaseMetrics ||
    !caseMetrics
  ) {
    return <Loader2 className="w-4 animate-spin" />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <MonthPicker date={date} setDate={setDate} />
      </div>

      {customer?.config?.isMerchantMonitoringEnabled ? (
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
      ) : (
        <div className="flex flex-col space-y-8">
          <CaseAnalytics
            totalCases={caseMetrics.totalActiveMerchants}
            totalActiveCases={caseMetrics.addedMerchantsCount}
            totalApprovedCases={caseMetrics.removedMerchantsCount}
            totalRejectedCases={caseMetrics.removedMerchantsCount}
          />
          <CaseGraphs
            userSelectedDate={date}
            activeCasesPerDay={caseMetrics.addedMerchantsCount}
            totalActiveCasesByStatus={caseMetrics.addedMerchantsCount}
            totalActiveCasesByRiskLevel={caseMetrics.addedMerchantsCount}
            totalApprovedCasesByRiskLevel={caseMetrics.addedMerchantsCount}
          />
        </div>
      )}
    </div>
  );
};
