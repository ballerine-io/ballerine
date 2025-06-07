import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { kybAndOwnershipAssessmentsQueryKey } from '@/domains/assessments/query-keys';
import { IKybAndOwnershipAssessmentParams } from '@/domains/assessments/fetchers';
import { useKybAndOwnershipAssessmentSSE } from '../useKybAndOwnershipAssessmentSSE';

export const useKybAndOwnershipAssessmentQuery = (params: IKybAndOwnershipAssessmentParams) => {
  const isAuthenticated = useIsAuthenticated();
  
  // Use SSE for real-time updates
  const { isConnected, error: sseError } = useKybAndOwnershipAssessmentSSE(params.id);

  const query = useQuery({
    ...kybAndOwnershipAssessmentsQueryKey.findById(params),
    enabled: isAuthenticated,
    // Remove polling since we're using SSE now
    // refetchInterval: 10000,
    // Only refetch on window focus if SSE is not connected
    refetchOnWindowFocus: !isConnected,
    // Stale time increased since SSE will handle updates
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    sseConnected: isConnected,
    sseError,
  };
};
