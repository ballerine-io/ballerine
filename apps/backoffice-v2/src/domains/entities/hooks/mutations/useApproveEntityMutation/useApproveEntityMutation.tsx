import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { queryKeys } from '../../../query-keys';
import { fetchWorkflowEvent } from '../../../../workflows/fetchers';
import { useEntityType } from '../../../../../common/hooks/useEntityType/useEntityType';

export const useApproveEntityMutation = ({
  endUserId,
  workflowId,
  onSelectNextEntity,
}: {
  endUserId: string;
  workflowId: string;
  onSelectNextEntity: VoidFunction;
}) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const entity = useEntityType();

  return useMutation({
    mutationFn: () =>
      fetchWorkflowEvent({
        workflowId,
        body: {
          name: 'approve',
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys[entity]?.list?.(filterId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys[entity]?.byId?.(endUserId, filterId).queryKey,
      });

      toast.success(t('toast:approve_case.success'));

      onSelectNextEntity();
    },
    onError: () => {
      toast.error(t('toast:approve_case.error'));
    },
  });
};
