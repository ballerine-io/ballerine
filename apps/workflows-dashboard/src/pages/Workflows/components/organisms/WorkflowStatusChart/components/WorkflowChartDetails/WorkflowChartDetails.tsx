import { calculateChartDataSum } from '@app/components/atoms/PieChart/utils/calculateChartDataSum';
import { WorkflowStatusChartData } from '@app/pages/Workflows/components/organisms/WorkflowStatusChart/WorkflowStatusChart';
import { useMemo } from 'react';

interface Props {
  data: WorkflowStatusChartData[];
}

export const WorkflowChartDetails = ({ data }: Props) => {
  const totalValue = useMemo(() => calculateChartDataSum(data), [data]);

  return (
    <div className="flex flex-col gap-2">
      {data.map((item, index) => {
        const percentOfTotal = ((item.value / totalValue) * 100).toFixed(2);
        return (
          <div key={`chart-details-item-${index}`} className="flex flex-row items-center gap-4 ">
            <div className={`h-1 w-4 rounded`} style={{ background: item.fillColor }} />
            <div className="flex text-xs">
              <div className="w-14">{percentOfTotal}%</div>
              <span className="font-medium">{item.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
