import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { collectionFlowQueryKeys } from '@/domains/collection-flow/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useCollectionFlowStateQuery = (workflowId: string | undefined) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...collectionFlowQueryKeys.state(workflowId!),
    enabled: !!workflowId && isAuthenticated,
  });
};
