import { MetricCard } from '@app/components/molecules/MetricCard';
import {
  WorkflowChart,
  WorkflowChartData,
} from '@app/pages/Workflows/components/organisms/WorkflowStatusChart';
import { useMemo } from 'react';

export interface ActivePerWorkflowChartData {
  workflowName: string;
  count: number;
  fillColor: string;
}

interface Props {
  isLoading?: boolean;
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

  console.log('chart data', chartData);

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
