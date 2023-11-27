import { MetricCard } from '@/components/molecules/MetricCard';
import {
  DailyResolvedCasesChart,
  DailyResolvedCasesChartData,
} from '@/pages/Overview/components/molecules/DailyResolvedCasesChart';
import { UsersResolvingStatsList } from '@/pages/Overview/components/molecules/UsersResolvingStatsList';
import { UserStats } from '@/pages/Overview/components/molecules/UserStats';
import { useCaseResolvingStatsQuery } from '@/pages/Overview/hooks/useCaseResolvingStatsQuery';
import { useUserDailyCaseResolvingStatsQuery } from '@/pages/Overview/hooks/useUserDailyCaseResolvingStatsQuery';
import { useUserStatsQuery } from '@/pages/Overview/hooks/useUserStatsQuery';
import { useMemo } from 'react';

export const OverviewTabContent = () => {
  const { isLoading, data } = useUserStatsQuery();
  const { data: caseResolvingStatsData } = useCaseResolvingStatsQuery();
  const { data: usersCaseResolvingStats, isLoading: isLoadingCaseResolvingStats } =
    useUserDailyCaseResolvingStatsQuery();

  const chartData = useMemo((): DailyResolvedCasesChartData[] => {
    return caseResolvingStatsData.map(item => ({
      value: item.count,
      date: new Date(item.date),
    }));
  }, [caseResolvingStatsData]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <UserStats isLoading={isLoading} userStats={data} />
      </div>
      <div className="flex-1">
        <div className="grid h-full grid-cols-12 gap-4">
          <MetricCard
            className="col-span-8"
            title={
              <MetricCard.Title
                className="text-sm"
                title={
                  <div className="flex justify-between">
                    <span>Resolved cases per day </span>
                    <span className="text-muted-foreground text-sm font-normal">
                      ( last 7 days )
                    </span>
                  </div>
                }
              />
            }
            content={<DailyResolvedCasesChart data={chartData} />}
          ></MetricCard>
          <MetricCard
            className="col-span-4"
            title={
              <MetricCard.Title
                title={
                  <MetricCard.Title
                    className="text-sm"
                    title={
                      <div className="flex justify-between">
                        <span>Agents resolved cases </span>
                        <span className="text-muted-foreground text-sm font-normal">( today )</span>
                      </div>
                    }
                  />
                }
              />
            }
            content={
              <UsersResolvingStatsList
                items={usersCaseResolvingStats}
                isLoading={isLoadingCaseResolvingStats}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
