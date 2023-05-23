import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action, Resource } from '../../../../enums';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { queryKeys } from '../../../query-keys';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';
import { fetchWorkflowEvent } from '../../../../workflows/fetchers';

export const useRejectEntityMutation = ({
  workflowId,
  entityId,
  onSelectNextEntity,
}: {
  workflowId: string;
  entityId: string;
  onSelectNextEntity: VoidFunction;
}) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const entity = useFilterEntity();

  return useMutation({
    mutationFn: (
      payload:
        | {
            action: typeof Action.REJECT;
          }
        | {
            action: typeof Action.RESUBMIT;
            documentToResubmit: string;
            resubmissionReason: string;
          },
    ) =>
      fetchWorkflowEvent({
        workflowId,
        body: {
          name: payload?.action?.toLowerCase(),
          ...(payload?.action === Action.RESUBMIT
            ? {
                document: payload?.documentToResubmit,
                resubmissionReason: payload?.resubmissionReason,
              }
            : {}),
        },
      }),
    onMutate: variables => ({
      resource: Resource.INDIVIDUAL,
      action: variables?.action,
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
