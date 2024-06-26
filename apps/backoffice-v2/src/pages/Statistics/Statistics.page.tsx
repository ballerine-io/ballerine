import React, { FunctionComponent } from 'react';
import { UserStatistics } from '@/pages/Statistics/components/UserStatistics/UserStatistics';
import { PortfolioRiskStatistics } from '@/pages/Statistics/components/PortfolioRiskStatistics/PortfolioRiskStatistics';
import { WorkflowStatistics } from '@/pages/Statistics/components/WorkflowStatistics/WorkflowStatistics';

export const Statistics: FunctionComponent = () => {
  return (
    <div>
      <h1 className={'pb-5 text-2xl font-bold'}>Statistics</h1>
      <div className={'flex flex-col space-y-8'}>
        <UserStatistics fullName={'John Doe'} />
        <PortfolioRiskStatistics />
        <WorkflowStatistics />
      </div>
    </div>
  );
};
