import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action, Resource } from '../../../../enums';
import { useFilterId } from 'hooks/useFilterId/useFilterId';
import toast from 'react-hot-toast';
import { t } from 'i18next';
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
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: queries[entity].list(filterId).queryKey });
      queryClient.invalidateQueries({
        queryKey: queries[entity].byId(entityId, filterId).queryKey,
      });

      const action = payload.action === Action.REJECT ? 'reject_case' : 'ask_resubmit_case';

      toast.success(t(`toast:${action}.success`));

      onSelectNextEntity();
    },
    onError: (error, payload) => {
      const action = payload.action === Action.REJECT ? 'reject_case' : 'ask_resubmit_case';

      toast.error(t(`toast:${action}.error`));
    },
  });
};
