import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';
import { fetchWorkflowEvent } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';

// @TODO: Refactor to be under cases/workflows domain
export const useApproveEntityMutation = ({
  workflowId,
  onSelectNextEntity,
}: {
  workflowId: string;
  onSelectNextEntity: VoidFunction;
}) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();

  return useMutation({
    mutationFn: () =>
      fetchWorkflowEvent({
        workflowId,
        body: {
          name: 'approve',
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries(workflowsQueryKeys.list(filterId).queryKey);

      toast.success(t('toast:approve_case.success'));

      onSelectNextEntity();
    },
    onError: () => {
      toast.error(t('toast:approve_case.error'));
    },
  });
};
