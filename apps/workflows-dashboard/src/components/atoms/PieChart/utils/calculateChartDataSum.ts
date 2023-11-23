import { PieChartData } from '@/components/atoms/PieChart/types';

export function calculateChartDataSum(chartData: PieChartData[]) {
  const sum = chartData.reduce((sum, dataItem) => (sum += dataItem.value), 0);

  return sum;
}
