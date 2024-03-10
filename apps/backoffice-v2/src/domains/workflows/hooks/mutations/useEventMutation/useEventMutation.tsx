import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { fetchWorkflowEvent } from '../../../fetchers';
import { workflowsQueryKeys } from '../../../query-keys';

export const useEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workflowId, event }: { workflowId: string; event: string }) =>
      fetchWorkflowEvent({
        workflowId,
        body: {
          name: event,
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t(`toast:event.success`));
    },
    onError: () => {
      toast.error(t(`toast:event.error`));
    },
  });
};
