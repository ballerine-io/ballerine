import {
  AgentCasesChart,
  AgentCasesChartData,
} from '@app/pages/Workflows/components/molecules/AgentCasesChart';
import { useAgentCasesStatsQuery } from '@app/pages/Workflows/components/organisms/metrics/AgentCasesStats/hooks/useAgentCasesStatsQuery';
import { useMemo } from 'react';

export const AgentCasesStats = () => {
  const { data = [], isLoading } = useAgentCasesStatsQuery();

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
