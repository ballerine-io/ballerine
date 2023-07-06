import { ChartProps } from '@app/pages/Workflows/components/molecules/common/types';
import { MetricListChart } from '@app/pages/Workflows/components/molecules/MetricListChart';
import { memo, useMemo } from 'react';

export interface AgentCasesChartData {
  id: string;
  agentName: string;
  casesCount: number;
}

interface Props extends ChartProps {
  data: AgentCasesChartData[];
}

export const AgentCasesChart = memo(({ isLoading, data }: Props) => {
  const chartItems = useMemo(
    () =>
      data.map(item => (
        <div
          className="flex flex-nowrap justify-between"
          key={`agent-cases-chart-data-key-${item.id}`}
        >
          <div className="text-sm">{item.agentName}</div>
          <div className="text-sm font-medium">{item.casesCount}</div>
        </div>
      )),
    [data],
  );

  return (
    <MetricListChart
      title="Assigned Cases per agent"
      description="( last 1 hour )"
      isLoading={isLoading}
      items={chartItems}
      emptyPlaceholder={<div className="text-sm font-medium">No active cases.</div>}
    />
  );
});
