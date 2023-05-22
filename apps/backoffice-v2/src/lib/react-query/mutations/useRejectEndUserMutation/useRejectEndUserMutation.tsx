import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import { queries } from '../../queries';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';
import toast from 'react-hot-toast';
import { t } from 'i18next';

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
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: queries[entity].list(filterId).queryKey });
      queryClient.invalidateQueries({
        queryKey: queries[entity].byId(endUserId, filterId).queryKey,
      });

      const action = payload.action === Action.REJECT ? 'reject_case' : 'ask_resubmit_case';

      toast.success(t(`toast:${action}.success`));

      onSelectNextEndUser();
    },
    onError: (error, payload) => {
      const action = payload.action === Action.REJECT ? 'reject_case' : 'ask_resubmit_case';

      toast.error(t(`toast:${action}.error`));
    },
  });
};
