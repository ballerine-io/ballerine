import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action } from '../../../../../common/enums';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { fetchWorkflowEvent } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';

// @TODO: Refactor to be under cases/workflows domain
export const useRejectEntityMutation = ({
  workflowId,
  onSelectNextEntity,
}: {
  workflowId: string;
  onSelectNextEntity: VoidFunction;
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
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

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
