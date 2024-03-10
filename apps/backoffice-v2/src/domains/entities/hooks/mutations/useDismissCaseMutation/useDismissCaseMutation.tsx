import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { fetchWorkflowEvent } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';

export const useDismissCaseMutation = ({
  workflowId,
  onSelectNextCase,
}: {
  workflowId: string;
  onSelectNextCase?: VoidFunction;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchWorkflowEvent({
        workflowId,
        body: {
          name: Action.DISMISS,
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:dismiss_case.success'));

      // TODO: Re-implement
      // onSelectNextEntity();
    },
    onError: () => {
      toast.error(t('toast:dismiss_case.error'));
    },
  });
};
