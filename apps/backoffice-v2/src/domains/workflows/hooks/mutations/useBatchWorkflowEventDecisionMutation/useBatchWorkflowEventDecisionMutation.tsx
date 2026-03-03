import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflowBatchEventDecision } from '@/domains/workflows/fetchers';
import { workflowsQueryKeys } from '@/domains/workflows/query-keys';

export const useBatchWorkflowEventDecisionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workflowIds,
      name,
      reason,
    }: {
      workflowIds: string[];
      name: 'approve' | 'reject' | 'revision';
      reason?: string;
    }) =>
      fetchWorkflowBatchEventDecision({
        workflowIds,
        body: {
          name,
          reason,
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries(workflowsQueryKeys._def);
    },
  });
};
