import {
  AgentsActivityChart,
  LoggedInAgentsChartData,
} from '@/pages/Workflows/components/molecules/AgentsActivityChart';
import { useActiveUsersQuery } from '@/pages/Workflows/components/organisms/metrics/AgentsActivityStats/hooks/useActiveUsersQuery';
import { useMemo } from 'react';

export const AgentsActivityStats = () => {
  const { data, isLoading } = useActiveUsersQuery();

  const chartData = useMemo(
    (): LoggedInAgentsChartData[] =>
      data.map(item => ({
        id: item.id,
        fullName: `${item.firstName} ${item.lastName}`,
        lastActiveAt: item.lastActiveAt ? new Date(item.lastActiveAt) : null,
      })),
    [data],
  );

  return <AgentsActivityChart isLoading={isLoading} data={chartData} />;
};
