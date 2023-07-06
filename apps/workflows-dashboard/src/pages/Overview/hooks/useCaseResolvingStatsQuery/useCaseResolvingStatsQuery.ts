import { userStatsQueryKeys } from '@app/domains/user/api/user-stats';
import { useQuery } from '@tanstack/react-query';
import * as dayjs from 'dayjs';
import { useMemo } from 'react';

export const useCaseResolvingStatsQuery = () => {
  const initialDate = useMemo(() => +dayjs().subtract(6, 'days').startOf('day').toDate(), []);
  const { data = [], isLoading } = useQuery(
    userStatsQueryKeys.userCaseResolvingStats({ fromDate: initialDate }),
  );

  return {
    data,
    isLoading,
  };
};
