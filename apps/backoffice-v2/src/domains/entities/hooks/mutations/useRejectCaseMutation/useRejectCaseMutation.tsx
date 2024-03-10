import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action } from '../../../../../common/enums';
import { toast } from 'sonner';
import { t } from 'i18next';
import { fetchWorkflowEvent } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';

// @TODO: Refactor to be under cases/workflows domain
export const useRejectCaseMutation = ({
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
          name: Action.REJECT,
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t(`toast:reject_case.success`));

      // TODO: Re-implement
      // onSelectNextEntity();
    },
    onError: () => {
      toast.error(t(`toast:reject_case.error`));
    },
  });
};
