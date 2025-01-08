import { Loader2 } from 'lucide-react';
import { FunctionComponent } from 'react';

import { MonthPicker } from './components/MonthPicker/MonthPicker';
import { PortfolioAnalytics } from './components/PortfolioAnalytics/PortfolioAnalytics';
import { PortfolioRiskStatistics } from './components/PortfolioRiskStatistics/PortfolioRiskStatistics';
import { useStatisticsLogic } from './hooks/useStatisticsLogic';

export const Statistics: FunctionComponent = () => {
  const { data, isLoading, error, date, setDate, registrationDate } = useStatisticsLogic();

  if (error) {
    throw error;
  }

  if (isLoading || !data) {
    return <Loader2 className="w-4 animate-spin" />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <MonthPicker date={date} setDate={setDate} minDate={registrationDate} />
      </div>

      <div className="flex flex-col space-y-8">
        <PortfolioAnalytics
          totalActiveMerchants={data.totalActiveMerchants}
          addedMerchantsCount={data.addedMerchantsCount}
          removedMerchantsCount={data.removedMerchantsCount}
        />
        {/* <UserStatistics fullName={'John Doe'} /> */}
        <PortfolioRiskStatistics
          riskLevelCounts={data.riskLevelCounts}
          violationCounts={data.violationCounts}
        />
        {/* <WorkflowStatistics /> */}
      </div>
    </div>
  );
};
