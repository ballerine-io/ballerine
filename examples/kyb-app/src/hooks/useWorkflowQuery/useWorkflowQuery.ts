import { workflowsQueryKeys } from '@app/domains/workflows/query-keys';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useWorkflowQuery = (workflowId?: string) => {
  const { data, isFetching, error } = useQuery({
    ...workflowsQueryKeys.get({ id: workflowId }),
    enabled: Boolean(workflowId),
    retry: false,
    staleTime: Infinity,
  });

  return {
    workflow: data ?? null,
    isLoading: isFetching,
    isFailedToLoad: Boolean(error),
    error: error as HTTPError,
  };
};
