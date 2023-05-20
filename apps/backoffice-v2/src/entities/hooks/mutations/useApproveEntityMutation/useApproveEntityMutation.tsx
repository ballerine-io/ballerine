import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { queryKeys } from '../../../../lib/react-query/query-keys';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';

export const useApproveEntityMutation = ({
  entityId,
  workflowId,
  onSelectNextEntity,
}: {
  entityId: string;
  workflowId: string;
  onSelectNextEntity: VoidFunction;
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
      resource: Resource.INDIVIDUAL,
      action: Action.APPROVE,
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys[entity as keyof typeof queryKeys].list(filterId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys[entity as keyof typeof queryKeys].byId(entityId, filterId).queryKey,
      });

      onSelectNextEntity();
    },
  });
};
