import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { IIdentityVerificationAssessmentsParams } from '@/domains/assessments/fetchers';
import { identityVerificationAssessmentsQueryKey } from '@/domains/assessments/query-keys';

export const useIdentityVerificationAssessmentsQuery = ({
  ...params
}: IIdentityVerificationAssessmentsParams) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...identityVerificationAssessmentsQueryKey.list(params),
    enabled: isAuthenticated,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });
};
