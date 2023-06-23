import { Card, CardContent, CardTitle } from '@app/components/atoms/Card';
import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import {
  WorkflowStatusPieChart,
  WorkflowStatusPieChartData,
} from '@app/pages/Workflows/components/molecules/WorkflowStatusPieChart';
import { WorkflowsMetric } from '@app/pages/Workflows/hooks/useWorkflowsMetric/types';
import { useMemo } from 'react';

interface Props {
  isLoading: boolean;
  metric: WorkflowsMetric | null;
}

export const WorkflowMetrics = ({ isLoading, metric }: Props) => {
  const pieChartData: WorkflowStatusPieChartData[] = useMemo(() => {
    if (!metric) return [];

    return Object.entries(metric.status).map(([key, value]) => {
      return {
        status: key as IWorkflowStatus,
        value,
      };
    });
  }, [metric]);

  return (
    <div className="grid grid-cols-12">
      <div className="flex h-full min-w-[300px] max-w-[300px]">
        <Card className="font-inter flex w-full flex-col p-4">
          <CardTitle>Overview</CardTitle>
          <CardContent className="flex flex-1 flex-col items-center justify-center p-0">
            <WorkflowStatusPieChart
              size={240}
              useLabel={isLoading ? false : true}
              data={
                isLoading
                  ? [{ status: 'placeholder' as any, fillColor: 'grey', value: 100 }]
                  : pieChartData
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
