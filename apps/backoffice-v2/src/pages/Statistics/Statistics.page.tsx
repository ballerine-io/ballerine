import React, { FunctionComponent, useCallback, useState } from 'react';
import { UserStatistics } from '@/pages/Statistics/components/UserStatistics/UserStatistics';
import { PortfolioRiskStatistics } from '@/pages/Statistics/components/PortfolioRiskStatistics/PortfolioRiskStatistics';
import { WorkflowStatistics } from '@/pages/Statistics/components/WorkflowStatistics/WorkflowStatistics';
import { useStatisticsQuery } from '@/pages/Statistics/statistics.query';
import { Loader2 } from 'lucide-react';

export const Statistics: FunctionComponent = () => {
  const { data } = useStatisticsQuery();

  if (!data) {
    return <Loader2 className={'w-4 animate-spin'} />;
  }

  return (
    <div>
      <h1 className={'pb-5 text-2xl font-bold'}>Statistics</h1>
      <div className={'flex flex-col space-y-8'}>
        <UserStatistics fullName={'John Doe'} />
        <PortfolioRiskStatistics data={data} />
        <WorkflowStatistics />
      </div>
    </div>
  );
};
