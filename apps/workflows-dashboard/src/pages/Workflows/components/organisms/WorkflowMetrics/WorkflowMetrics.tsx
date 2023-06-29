import { Card, CardContent } from '@app/components/atoms/Card';
import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import { useWorkflowsMetric } from '@app/pages/Overview/hooks/useWorkflowsMetric';
import { sortWorkflowChartDataByStatus } from '@app/pages/Workflows/components/organisms/WorkflowMetrics/helpers';
import {
  getChartColorByWorkflowStatus,
  getChartLabelByStatus,
  WorkflowStatusChart,
  WorkflowStatusChartData,
} from '@app/pages/Workflows/components/organisms/WorkflowStatusChart';
import { useMemo } from 'react';

export const WorkflowMetrics = () => {
  const { data: metric } = useWorkflowsMetric();

  const pieChartData: WorkflowStatusChartData[] = useMemo(() => {
    if (!metric) return [];

    const chartData = Object.entries(metric.status).map(([key, value]) => {
      return {
        status: key as IWorkflowStatus,
        value,
        fillColor: getChartColorByWorkflowStatus(key as IWorkflowStatus),
        label: getChartLabelByStatus(key as IWorkflowStatus),
      };
    });

    return sortWorkflowChartDataByStatus(chartData);
  }, [metric]);

  return (
    <div className="flex">
      <div className="flex h-full ">
        <Card className="font-inter flex w-full flex-col p-4">
          <CardContent className="flex flex-1 flex-col  p-0">
            <WorkflowStatusChart size={160} innerRadius={60} outerRadius={80} data={pieChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
