import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { fetchWorkflowEvent } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';

// @TODO: Refactor to be under cases/workflows domain
export const useApproveEntityMutation = ({
  workflowId,
  onSelectNextEntity,
}: {
  workflowId: string;
  onSelectNextEntity?: VoidFunction;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchWorkflowEvent({
        workflowId,
        body: {
          name: Action.APPROVE.toLowerCase(),
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t('toast:approve_case.success'));

      // TODO: Re-implement
      // onSelectNextEntity();
    },
    onError: () => {
      toast.error(t('toast:approve_case.error'));
    },
  });
};
