import { MetricCard } from '@app/components/molecules/MetricCard';
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
    <div className="flex w-full gap-4">
      <MetricCard
        className="min-h-[260px] w-1/4"
        title={<MetricCard.Title title="Active per workflow" />}
        content={
          <MetricCard.Content>
            <WorkflowStatusChart size={160} innerRadius={60} outerRadius={80} data={pieChartData} />
          </MetricCard.Content>
        }
      />
      <MetricCard
        className="w-1/4 min-w-[260px]"
        title={<MetricCard.Title title="Logged in agents" />}
        content="hello world"
        description="(last 1 hour)"
      />
      <MetricCard
        className="w-1/4 min-w-[260px]"
        title={<MetricCard.Title title="Assigned cases per agent" />}
        content="hello world"
        description="(last 1 hour)"
      />
      <MetricCard
        className="w-1/4 min-w-[260px]"
        title={<MetricCard.Title title="Amount of cases per status" />}
        content="hello world"
        description="(last 1 hour)"
      />
    </div>
  );
};
