import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { queries } from '../../queries';
import { useKind } from 'hooks/useKind/useKind';

export const useRejectEndUserMutation = ({
  workflowId,
  endUserId,
  onSelectNextEndUser,
}: {
  workflowId: string;
  endUserId: string;
  onSelectNextEndUser: VoidFunction;
}) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const kind = useKind();

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
      api.workflows.event({
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
      resource: Resource.END_USER,
      action: variables?.action,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries[kind].list(filterId).queryKey });
      queryClient.invalidateQueries({
        queryKey: queries[kind].byId(endUserId).queryKey,
      });

      onSelectNextEndUser();
    },
  });
};
