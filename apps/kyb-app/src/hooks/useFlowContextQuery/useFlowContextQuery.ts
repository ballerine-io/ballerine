import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useEndUserQuery } from '../useEndUserQuery';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';

export const useFlowContextQuery = () => {
  const workflowId = useWorkflowId();
  const { data: endUser } = useEndUserQuery();

  const { data, isLoading, isFetched, error, refetch } = useQuery({
    ...collectionFlowQuerykeys.getContext(endUser?.id ?? null),
    // @ts-ignore
    staleTime: Infinity as const,
    enabled: !!workflowId,
  });

  return {
    data,
    isLoading,
    isLoaded: isFetched,
    error: error ? (error as HTTPError) : null,
    refetch,
  };
};
