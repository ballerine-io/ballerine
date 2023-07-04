import * as dayjs from 'dayjs';
import { IUserStats, userStatsQueryKeys } from '@app/domains/user/api/user-stats';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const defaultValues: IUserStats = {
  approvalRate: 0,
  averageResolutionTime: 0,
  averageReviewTime: 0,
  averageAssignmentTime: 0,
};

export const useUserStatsQuery = () => {
  const initialDate = useMemo(() => +dayjs().subtract(30, 'days').toDate(), []);
  const { data = defaultValues, isLoading } = useQuery(
    userStatsQueryKeys.userStats({ fromDate: initialDate }),
  );

  return {
    data,
    isLoading,
  };
};
