import { PieChartData } from '@app/components/atoms/PieChart/types';

export function calculateChartDataSum(chartData: PieChartData[]): number {
  const sum = chartData.reduce((sum, dataItem) => (sum += dataItem.value), 0);

  return sum;
}
