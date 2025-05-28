import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { IKybAndOwnershipAssessmentsParams } from '@/domains/assessments/fetchers';
import { kybAndOwnershipAssessmentsQueryKey } from '@/domains/assessments/query-keys';

export const useKybAndOwnershipAssessmentsQuery = (params: IKybAndOwnershipAssessmentsParams) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...kybAndOwnershipAssessmentsQueryKey.list(params),
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });
};
