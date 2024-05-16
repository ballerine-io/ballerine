import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action } from '../../../../../common/enums';
import { toast } from 'sonner';
import { t } from 'i18next';
import { fetchWorkflowEvent } from '../../../fetchers';
import { workflowsQueryKeys } from '../../../query-keys';

export const useRevisionCaseMutation = ({
  onSelectNextCase,
}: {
  onSelectNextCase?: VoidFunction;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workflowId }: { workflowId: string }) =>
      fetchWorkflowEvent({
        workflowId,
        body: {
          name: Action.REVISION,
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t(`toast:ask_revision_case.success`));

      // TODO: Re-implement
      // onSelectNextEntity();
    },
    onError: () => {
      toast.error(t(`toast:ask_revision_case.error`));
    },
  });
};
