import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { endUsers } from '../../end-users';
import { Action, Resource } from '../../../../enums';

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
      queryClient.invalidateQueries({ queryKey: endUsers.list().queryKey });
      queryClient.invalidateQueries({
        queryKey: endUsers.byId(endUserId).queryKey,
      });

      onSelectNextEndUser();
    },
  });
};
