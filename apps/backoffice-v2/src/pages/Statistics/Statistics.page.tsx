import React, { FunctionComponent } from 'react';
import { UserStatistics } from '@/pages/Statistics/components/UserStatistics/UserStatistics';
import { PortfolioRiskStatistics } from '@/pages/Statistics/components/PortfolioRiskStatistics/PortfolioRiskStatistics';
import { WorkflowStatistics } from '@/pages/Statistics/components/WorkflowStatistics/WorkflowStatistics';
import { Loader2 } from 'lucide-react';
import { useBusinessReportMetricsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';

export const Statistics: FunctionComponent = () => {
  const { data, isLoading, error } = useBusinessReportMetricsQuery();

  if (error) {
    throw error;
  }

  if (isLoading || !data) {
    return <Loader2 className={'w-4 animate-spin'} />;
  }

  return (
    <div>
      <h1 className={'pb-5 text-2xl font-bold'}>Statistics</h1>
      <div className={'flex flex-col space-y-8'}>
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
