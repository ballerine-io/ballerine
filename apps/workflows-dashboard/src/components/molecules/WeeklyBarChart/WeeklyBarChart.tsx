import { memo, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getWeekDayName } from '@/components/molecules/WeeklyBarChart/utils/get-week-day-name';

export interface WeeklyBarChartData {
  value: number;
  date: Date;
}

interface BarChartData {
  name: string;
  value: number;
}

interface Props {
  data: WeeklyBarChartData[];
}

export const WeeklyBarChart = memo(({ data }: Props) => {
  const chartData = useMemo((): BarChartData[] => {
    return data.map(item => ({
      name: `${getWeekDayName(item.date)} ${item.date.getDate()}`,
      value: item.value,
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={'100%'}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          fontSize={12}
          tickLine={false}
          axisLine={false}
          padding={{ top: 0, bottom: 0 }}
          allowDecimals={false}
        />
        <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
});
