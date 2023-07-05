import { useSession } from '@app/common/hooks/useSession';
import { userStatsQueryKeys } from '@app/domains/user/api/user-stats';
import { useQuery } from '@tanstack/react-query';
import * as dayjs from 'dayjs';
import { useMemo } from 'react';

export const useCaseResolvingStatsQuery = () => {
  const initialDate = useMemo(() => +dayjs().subtract(6, 'day').startOf('day').toDate(), []);
  const { user } = useSession();
  const { data = [], isLoading } = useQuery({
    ...userStatsQueryKeys.userDailyCasesResolvedStats({ fromDate: initialDate, userId: user!.id }),
    enabled: Boolean(initialDate),
  });

  return {
    data,
    isLoading,
  };
};
