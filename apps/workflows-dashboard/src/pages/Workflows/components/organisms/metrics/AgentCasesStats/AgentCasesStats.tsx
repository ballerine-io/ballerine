import {
  AgentCasesChart,
  AgentCasesChartData,
} from '@/pages/Workflows/components/molecules/AgentCasesChart';
import { useUsersAssignedCasesStatsQuery } from '@/pages/Workflows/components/organisms/metrics/AgentCasesStats/hooks/useUsersAssignedCasesStatsQuery';
import { useMemo } from 'react';

export const AgentCasesStats = () => {
  const { data = [], isLoading } = useUsersAssignedCasesStatsQuery();

  const chartData = useMemo(
    (): AgentCasesChartData[] =>
      data?.map(item => ({
        id: item.id,
        agentName: `${item.firstName} ${item.lastName}`,
        casesCount: item.casesCount,
      })),
    [data],
  );

  return <AgentCasesChart isLoading={isLoading} data={chartData} />;
};
