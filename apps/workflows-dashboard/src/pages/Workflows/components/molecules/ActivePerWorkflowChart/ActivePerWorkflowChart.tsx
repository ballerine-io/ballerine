import { MetricCard } from '@/components/molecules/MetricCard';
import { ChartProps } from '@/pages/Workflows/components/molecules/common/types';
import {
  WorkflowChart,
  WorkflowChartData,
} from '@/pages/Workflows/components/organisms/WorkflowStatusChart';
import { useMemo } from 'react';

export interface ActivePerWorkflowChartData {
  workflowName: string;
  count: number;
  fillColor: string;
}

interface Props extends ChartProps {
  data: ActivePerWorkflowChartData[];
}

export const ActivePerWorkflowChart = ({ isLoading, data }: Props) => {
  const chartData: WorkflowChartData[] = useMemo(
    () =>
      data.map(item => ({
        label: item.workflowName,
        value: item.count,
        fill: item.fillColor,
      })),
    [data],
  );

  return (
    <MetricCard
      isLoading={isLoading}
      title={<MetricCard.Title title="Active per workflow" />}
      content={
        <MetricCard.Content>
          <WorkflowChart size={90} innerRadius={26} outerRadius={40} data={chartData} />
        </MetricCard.Content>
      }
    />
  );
};
