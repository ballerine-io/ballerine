import { PieChart, PieChartData } from '@app/components/atoms/PieChart';
import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import { WorkflowChartDetails } from '@app/pages/Workflows/components/organisms/WorkflowStatusChart/components/WorkflowChartDetails';
import { memo } from 'react';

export interface WorkflowChartData extends PieChartData {
  label: string;
}

export type WorkflowStatusCount = Record<IWorkflowStatus, number>;

interface Props {
  data: WorkflowChartData[];
  size: number;
  innerRadius: number;
  outerRadius: number;
}

export const WorkflowChart = memo(({ data, size, innerRadius, outerRadius }: Props) => {
  return (
    <div className="align-center flex flex-row flex-nowrap gap-8">
      <div>
        <PieChart data={data} size={size} innerRadius={innerRadius} outerRadius={outerRadius} />
      </div>
      <div className="align-center flex flex-col justify-center">
        <WorkflowChartDetails data={data} />
      </div>
    </div>
  );
});
