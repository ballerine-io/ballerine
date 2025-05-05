import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useEndUserQuery } from '../useEndUserQuery';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';

export const useUISchemasQuery = (language: string) => {
  const workflowId = useWorkflowId();
  const { data: endUser, isLoading: isEndUserLoading } = useEndUserQuery();

  const { data, isLoading, error } = useQuery({
    ...collectionFlowQuerykeys.getUISchema({ language, endUserId: endUser?.id ?? null }),
    // @ts-ignore
    staleTime: Infinity as const,
    enabled: !isEndUserLoading && !!language && !!workflowId,
  });

  return {
    isLoading,
    data: data ?? null,
    error: error ? (error as HTTPError) : null,
  };
};
