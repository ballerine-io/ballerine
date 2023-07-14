import { userStatsQueryKeys } from '@app/domains/user/api/user-stats';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export const useCaseResolvingStatsQuery = () => {
  const initialDate = useMemo(() => +dayjs().subtract(6, 'day').startOf('day').toDate(), []);
  const { data = [], isLoading } = useQuery({
    ...userStatsQueryKeys.userDailyCasesResolvedStats({ fromDate: initialDate }),
    enabled: Boolean(initialDate),
  });

  return {
    data,
    isLoading,
  };
};
