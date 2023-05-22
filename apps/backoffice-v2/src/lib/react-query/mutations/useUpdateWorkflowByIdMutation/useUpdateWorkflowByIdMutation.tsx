import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api/api';
import { Action, Resource } from '../../../../enums';
import toast from 'react-hot-toast';
import { t } from 'i18next';

export const useUpdateWorkflowByIdMutation = ({ workflowId }: { workflowId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      context,
    }: {
      context: Record<PropertyKey, unknown>;
      action:
        | 'approve_document'
        | 'reject_document'
        | 'ask_resubmit_document'
        | 'update_document_properties';
    }) =>
      api.workflows.updateById({
        workflowId,
        body: {
          context,
        },
      }),
    onSuccess: (data, { action }) => {
      void queryClient.invalidateQueries();
      toast.success(t(`toast:${action}.success`));
    },
    onError: (error, { action }) => {
      toast.error(t(`toast:${action}.error`));
    },
  });
};
