import { PieChartData } from '@/components/atoms/PieChart/types';
import { calculateChartDataSum } from '@/components/atoms/PieChart/utils/calculateChartDataSum';
import { useMemo } from 'react';
import * as RechartPrimitive from 'recharts';

interface Props {
  size: number;
  outerRadius: number;
  innerRadius: number;
  data: PieChartData[];
}

export const PieChart = ({ size, data, outerRadius, innerRadius }: Props) => {
  const totalValue = useMemo(() => calculateChartDataSum(data), [data]);

  return (
    <RechartPrimitive.PieChart
      width={size}
      height={size}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <RechartPrimitive.Pie
        data={data}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
        fill="#000000"
        dataKey="value"
        animationBegin={200}
        animationDuration={800}
      >
        {/* {data.map((data, index) => (
          <RechartPrimitive.Cell
            key={`cell-${index}`}
            fill={data.fillColor ? data.fillColor : undefined}
          />
        ))} */}
        <RechartPrimitive.Label position={'center'} style={{ fontWeight: 'bold' }}>
          {totalValue}
        </RechartPrimitive.Label>
      </RechartPrimitive.Pie>
    </RechartPrimitive.PieChart>
  );
};
