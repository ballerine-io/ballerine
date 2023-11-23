import { useMemo } from 'react';
import { WeeklyBarChart } from '@/components/molecules/WeeklyBarChart';

export interface DailyResolvedCasesChartData {
  value: number;
  date: Date;
}

interface Props {
  data: DailyResolvedCasesChartData[];
}

export const DailyResolvedCasesChart = ({ data }: Props) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: new Date(item.date),
      value: item.value,
    }));
  }, [data]);

  return <WeeklyBarChart data={chartData} />;
};
