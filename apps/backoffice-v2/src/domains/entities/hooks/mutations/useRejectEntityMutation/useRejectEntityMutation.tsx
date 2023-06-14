import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action } from '../../../../../common/enums';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { fetchWorkflowEvent } from '../../../../workflows/fetchers';
import { queryKeys } from '../../../query-keys';
import { useEntityType } from '../../../../../common/hooks/useEntityType/useEntityType';

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
  const entity = useEntityType();

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
      void queryClient.invalidateQueries({
        queryKey: queryKeys[entity]?.list?.(filterId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys[entity].byId(entityId, filterId).queryKey,
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
