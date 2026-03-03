import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { IIdentityVerificationAssessmentParams } from '@/domains/assessments/fetchers';
import { identityVerificationAssessmentsQueryKey } from '@/domains/assessments/query-keys';

export const useIdentityVerificationAssessmentQuery = (
  params: IIdentityVerificationAssessmentParams,
) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...identityVerificationAssessmentsQueryKey.findById(params),
    enabled: isAuthenticated && !!params.id,
    refetchInterval: 10000,
  });
};
