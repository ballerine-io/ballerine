import { usersStatsQueryKeys } from '@app/domains/user/api/users-stats';
import { useQuery } from '@tanstack/react-query';
import * as dayjs from 'dayjs';
import { useMemo } from 'react';

export const useUsersCaseResolvingStatsQuery = () => {
  const initialDate = useMemo(() => +dayjs().startOf('day').toDate(), []);
  const { data = [], isLoading } = useQuery(
    usersStatsQueryKeys.caseResolvingStatsList({ fromDate: initialDate }),
  );

  return {
    data,
    isLoading,
  };
};
