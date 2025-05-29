import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { kybAndOwnershipAssessmentsQueryKey } from '@/domains/assessments/query-keys';
import { IKybAndOwnershipAssessmentParams } from '@/domains/assessments/fetchers';

export const useKybAndOwnershipAssessmentQuery = (params: IKybAndOwnershipAssessmentParams) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...kybAndOwnershipAssessmentsQueryKey.findById(params),
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });
};
