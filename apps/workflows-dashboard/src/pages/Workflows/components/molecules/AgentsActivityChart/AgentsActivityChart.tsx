import classnames from 'classnames';
import dayjs from 'dayjs';
import { ChartProps } from '@/pages/Workflows/components/molecules/common/types';
import { MetricListChart } from '@/pages/Workflows/components/molecules/MetricListChart';
import { useMemo } from 'react';

export interface LoggedInAgentsChartData {
  id: string;
  fullName: string;
  lastActiveAt: Date | null;
}

interface Props extends ChartProps {
  data: LoggedInAgentsChartData[];
}

export const AgentsActivityChart = ({ isLoading, data }: Props) => {
  const chartItems = useMemo(
    () =>
      data.map(item => {
        const hourDifference = Math.abs(dayjs(item.lastActiveAt).diff(Date.now(), 'hour'));

        return (
          <div
            className="flex flex-nowrap items-center justify-between"
            key={`agent-cases-chart-data-key-${item.id}`}
          >
            <div className="text-sm">{item.fullName}</div>
            <div
              className={classnames('h-4 w-4 rounded-full', {
                'bg-red-600': hourDifference > 1,
                'bg-green-600': hourDifference < 1,
              })}
            ></div>
          </div>
        );
      }),
    [data],
  );

  return (
    <MetricListChart
      title="Online/Offline Agents"
      isLoading={isLoading}
      items={chartItems}
      emptyPlaceholder={<div>No recent activity found.</div>}
    />
  );
};
