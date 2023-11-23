import dayjs from 'dayjs';
import { UserStats, userStatsQueryKeys } from '@/domains/user/api/user-stats';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const defaultValues: UserStats = {
  approvalRate: 0,
  averageResolutionTime: 0,
  averageReviewTime: 0,
  averageAssignmentTime: 0,
};

export const useUserStatsQuery = () => {
  const initialDate = useMemo(() => +dayjs().subtract(30, 'days').toDate(), []);
  const { data = defaultValues, isLoading } = useQuery(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    userStatsQueryKeys.userStats({ fromDate: initialDate }),
  );

  return {
    data,
    isLoading,
  };
};
