import React, { FunctionComponent } from 'react';
import { UserStats } from '@/pages/Statistics/components/UserStats/UserStats';
import { PortfolioRiskStats } from '@/pages/Statistics/components/PortfolioRiskStats/PortfolioRiskStats';
import { WorkflowStats } from '@/pages/Statistics/components/WorkflowStats/WorkflowStats';

export const Statistics: FunctionComponent = () => {
  return (
    <div>
      <h1 className={'pb-5 text-2xl font-bold'}>Statistics</h1>
      <div className={'flex flex-col space-y-8'}>
        <UserStats fullName={'John Doe'} />
        <PortfolioRiskStats />
        <WorkflowStats />
      </div>
    </div>
  );
};
