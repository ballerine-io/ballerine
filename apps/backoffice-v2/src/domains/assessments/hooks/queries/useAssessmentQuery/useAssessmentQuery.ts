import { useQuery } from '@tanstack/react-query';

import { IKybAndOwnershipAssessmentParams } from '@/domains/assessments/fetchers';
import { assessmentsQueryKey } from '@/domains/assessments/query-keys';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useAssessmentQuery = (params: IKybAndOwnershipAssessmentParams) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...assessmentsQueryKey.findById(params),
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });
};
