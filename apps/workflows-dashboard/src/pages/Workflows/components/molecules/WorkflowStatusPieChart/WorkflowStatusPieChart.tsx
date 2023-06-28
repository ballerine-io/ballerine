import { IWorkflowStatus } from '@app/domains/workflows/api/workflow';
import { useMemo } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export interface WorkflowStatusPieChartData {
  status: IWorkflowStatus;
  fillColor?: string;
  value: number;
}

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

interface Props {
  data: WorkflowStatusPieChartData[];
  size: number;
  useLabel?: boolean;
}

export const WorkflowStatusPieChart = ({ data, size, useLabel }: Props) => {
  const chartData = useMemo(() => {
    return data.map(data => {
      return {
        name: data.status,
        value: data.value,
      };
    });
  }, [data]);

  return (
    <PieChart width={size} height={size}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={useLabel ? true : undefined}
        outerRadius={80}
        fill="#000000"
        dataKey="value"
      >
        {data.map((data, index) => (
          <Cell
            key={`cell-${index}`}
            fill={data.fillColor ? data.fillColor : COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
  );
};
