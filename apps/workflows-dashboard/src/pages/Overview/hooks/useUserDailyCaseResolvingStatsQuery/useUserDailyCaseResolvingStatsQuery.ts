import { usersStatsQueryKeys } from '@/domains/user/api/users-stats';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export const useUserDailyCaseResolvingStatsQuery = () => {
  const initialDate = useMemo(() => +dayjs().startOf('day').toDate(), []);
  const { data = [], isLoading } = useQuery(
    usersStatsQueryKeys.casesResolvedStats({ fromDate: initialDate }),
  );

  return {
    data,
    isLoading,
  };
};
