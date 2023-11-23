import {
  ActivePerWorkflowChart,
  ActivePerWorkflowChartData,
} from '@/pages/Workflows/components/molecules/ActivePerWorkflowChart';
import { useActivePerWorkflowStatsQuery } from '@/pages/Workflows/components/organisms/metrics/ActivePerWorkflow/hooks/useActivePerWorkflowStatsQuery';
import { useMemo } from 'react';

const colorScheme = ['#52D726', '#FFEC00', '#FF7300', '#FF0000'];

export const ActivePerWorkflow = () => {
  const { data, isLoading } = useActivePerWorkflowStatsQuery();

  const chartData = useMemo(
    (): ActivePerWorkflowChartData[] =>
      data.map((item, index) => ({
        workflowName: item.name,
        count: item.active,
        fillColor: colorScheme[index] || '#000',
      })),
    [data],
  );

  return <ActivePerWorkflowChart isLoading={isLoading} data={chartData} />;
};
