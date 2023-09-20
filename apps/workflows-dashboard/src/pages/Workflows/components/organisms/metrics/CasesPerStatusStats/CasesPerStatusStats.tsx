import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import {
  CasesPerStatusChart,
  CasesPerStatusChartData,
} from '@app/pages/Workflows/components/molecules/CasesPerStatusChart';
import { useCasesPerStatusQuery } from '@app/pages/Workflows/components/organisms/metrics/CasesPerStatusStats/hooks/useCasesPerStatusQuery';
import { useMemo } from 'react';

const statusToTitleMap: Record<IWorkflowStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  failed: 'Failed',
};

export const CasesPerStatusStats = () => {
  const { data, isLoading } = useCasesPerStatusQuery();

  const chartData = useMemo(
    (): CasesPerStatusChartData[] =>
      Object.entries(data)
        .map(([status, count]) => ({
          id: status,
          status: statusToTitleMap[status as IWorkflowStatus] || status,
          casesCount: count,
        }))
        .sort((dataA, dataB) => dataA.status.localeCompare(dataB.status)),
    [data],
  );

  return <CasesPerStatusChart isLoading={isLoading} data={chartData} />;
};
