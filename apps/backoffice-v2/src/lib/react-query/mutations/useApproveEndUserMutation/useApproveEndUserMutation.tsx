import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { queries } from '../../queries';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';

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
    onMutate: () => ({
      resource: Resource.END_USER,
      action: Action.APPROVE,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries[entity].list(filterId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries[entity].byId(endUserId, filterId).queryKey,
      });

      onSelectNextEndUser();
    },
  });
};
