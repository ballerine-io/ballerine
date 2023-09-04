import { workflowsQueryKeys } from '@app/domains/workflows/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useWorkflowQuery = (workflowId?: string) => {
  const { data, isLoading, error } = useQuery({
    ...workflowsQueryKeys.get({ id: workflowId }),
    enabled: Boolean(workflowId),
    retry: false,
  });

  return {
    workflow: data ?? null,
    isLoading,
    isFailedToLoad: Boolean(error),
    error: error as Error,
  };
};
