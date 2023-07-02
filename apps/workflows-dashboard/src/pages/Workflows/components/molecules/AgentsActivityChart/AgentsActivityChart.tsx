import { ChartProps } from '@app/pages/Workflows/components/molecules/common/types';
import { MetricListChart } from '@app/pages/Workflows/components/molecules/MetricListChart';
import { useMemo } from 'react';

export interface LoggedInAgentsChartData {
  id: string;
  fullName: string;
  lastActiveAt: Date | null;
}

interface Props extends ChartProps {
  data: LoggedInAgentsChartData[];
}

export const AgentsActivityChart = ({ isLoading, data }: Props) => {
  const chartItems = useMemo(
    () =>
      data.map(item => (
        <div
          className="flex flex-nowrap justify-between"
          key={`agent-cases-chart-data-key-${item.id}`}
        >
          <div className="text-sm">{item.fullName}</div>
        </div>
      )),
    [data],
  );

  return (
    <MetricListChart
      title="Logged in agents"
      description={'( last 1 hour )'}
      isLoading={isLoading}
      items={chartItems}
      emptyPlaceholder={<div>No recent activity found.</div>}
    />
  );
};
