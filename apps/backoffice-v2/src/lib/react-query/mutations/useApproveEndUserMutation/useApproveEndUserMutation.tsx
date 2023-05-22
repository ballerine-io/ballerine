import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { queries } from '../../queries';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';
import toast from 'react-hot-toast';
import { t } from 'i18next';

export const useApproveEndUserMutation = ({
  endUserId,
  workflowId,
  onSelectNextEndUser,
}: {
  endUserId: string;
  workflowId: string;
  onSelectNextEndUser: VoidFunction;
}) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const entity = useFilterEntity();

  return useMutation({
    mutationFn: () =>
      api.workflows.event({
        workflowId,
        body: {
          name: 'approve',
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries[entity].list(filterId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries[entity].byId(endUserId, filterId).queryKey,
      });

      toast.success(t('toast:approve_case.success'));

      onSelectNextEndUser();
    },
    onError: () => {
      toast.error(t('toast:approve_case.error'));
    },
  });
};
