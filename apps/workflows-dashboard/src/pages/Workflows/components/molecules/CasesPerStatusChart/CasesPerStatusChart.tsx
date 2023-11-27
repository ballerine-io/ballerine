import { ChartProps } from '@/pages/Workflows/components/molecules/common/types';
import { MetricListChart } from '@/pages/Workflows/components/molecules/MetricListChart';
import { useMemo } from 'react';

export interface CasesPerStatusChartData {
  id: string;
  status: string;
  casesCount: number;
}

interface Props extends ChartProps {
  data: CasesPerStatusChartData[];
}

export const CasesPerStatusChart = ({ isLoading, data }: Props) => {
  const chartItems = useMemo(
    () =>
      data.map(item => (
        <div
          className="flex flex-nowrap justify-between"
          key={`agent-cases-chart-data-key-${item.id}`}
        >
          <div className="text-sm font-medium">{item.status}</div>
          <div className="text-sm font-medium">{item.casesCount}</div>
        </div>
      )),
    [data],
  );

  return (
    <MetricListChart title="Amount of cases per status" isLoading={isLoading} items={chartItems} />
  );
};
