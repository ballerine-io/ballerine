import React, { FunctionComponent, useCallback, useState } from 'react';
import { UserStatistics } from '@/pages/Statistics/components/UserStatistics/UserStatistics';
import { PortfolioRiskStatistics } from '@/pages/Statistics/components/PortfolioRiskStatistics/PortfolioRiskStatistics';
import { WorkflowStatistics } from '@/pages/Statistics/components/WorkflowStatistics/WorkflowStatistics';
import { useStatisticsQuery } from '@/pages/Statistics/statistics.query';
import { Loader, Loader2 } from 'lucide-react';
import { SortDirection } from '@ballerine/common';

export const Statistics: FunctionComponent = () => {
  const [violationsSorting, setViolationsSorting] = useState<SortDirection>('desc');
  const { data } = useStatisticsQuery({
    violationsDirection: violationsSorting,
  });

  if (!data) {
    return <Loader2 className={'w-4 animate-spin'} />;
  }

  return (
    <div>
      <h1 className={'pb-5 text-2xl font-bold'}>Statistics</h1>
      <div className={'flex flex-col space-y-8'}>
        <UserStatistics fullName={'John Doe'} />
        <PortfolioRiskStatistics
          data={data}
          violationsSorting={violationsSorting}
          setViolationsSorting={setViolationsSorting}
        />
        <WorkflowStatistics />
      </div>
    </div>
  );
};
