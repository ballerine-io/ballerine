import { workflowsQueryKeys } from '@app/domains/workflows/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useWorkflowQuery = (workflowId?: string) => {
  const { data, isLoading } = useQuery({
    ...workflowsQueryKeys.get({ id: workflowId }),
    enabled: Boolean(workflowId),
  });

  return {
    workflow: data ?? null,
    isLoading,
  };
};
