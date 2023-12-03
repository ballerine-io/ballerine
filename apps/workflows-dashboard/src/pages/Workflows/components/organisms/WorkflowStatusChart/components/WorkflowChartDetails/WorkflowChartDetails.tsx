import { calculateChartDataSum } from '@/components/atoms/PieChart/utils/calculateChartDataSum';
import { WorkflowChartData } from '@/pages/Workflows/components/organisms/WorkflowStatusChart/WorkflowStatusChart';
import { useMemo } from 'react';

interface Props {
  data: WorkflowChartData[];
}

export const WorkflowChartDetails = ({ data }: Props) => {
  const totalValue = useMemo(() => calculateChartDataSum(data), [data]);

  return (
    <div className="flex flex-col gap-2">
      {data.map((item, index) => {
        const percentOfTotal = ((item.value / totalValue) * 100).toFixed(2);
        return (
          <div
            key={`chart-details-item-${index}`}
            className="flex md:flex-col md:items-start md:gap-1 lg:flex-row lg:items-center lg:gap-4 "
            title={item.label}
          >
            <div className={`h-1 min-w-[20px] rounded`} style={{ background: item.fill }} />
            <div className="flex gap-1 text-xs md:flex-col lg:flex-row">
              <div className="w-14">{percentOfTotal}%</div>
              <span className="line-clamp-1 break-all font-medium">{item.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
