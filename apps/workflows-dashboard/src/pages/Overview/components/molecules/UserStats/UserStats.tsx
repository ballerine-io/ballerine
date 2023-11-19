import { UserStats as IUserStats } from '@/domains/user/api/user-stats';
import { DurationCard } from '@/pages/Overview/components/molecules/UserStats/components/DurationCard';
import { PercentageCard } from '@/pages/Overview/components/molecules/UserStats/components/PercentageCard';

interface Props {
  userStats: IUserStats;
  isLoading: boolean;
}

export const UserStats = ({ userStats, isLoading }: Props) => {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
      <PercentageCard
        title="Approved rate out of resolved"
        isLoading={isLoading}
        percentage={userStats.approvalRate}
      />
      <DurationCard
        title="Average resolution time"
        isLoading={isLoading}
        duration={userStats.averageResolutionTime}
      />
      <DurationCard
        title="Average time to assignment"
        isLoading={isLoading}
        duration={userStats.averageAssignmentTime}
      />
      <DurationCard
        title="Average review time"
        isLoading={isLoading}
        duration={userStats.averageReviewTime}
      />
    </div>
  );
};
