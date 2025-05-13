import { updateCollectionFlowState } from '@/domains/collection-flow/fetchers';
import { TCollectionFlowState } from '@/domains/collection-flow/schemas';
import { queryClient } from '@/lib/react-query/query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { collectionFlowQueryKeys } from '@/domains/collection-flow/query-keys';
import { isErrorWithMessage } from '@ballerine/common';

export const useUpdateCollectionFlowStateMutation = () => {
  return useMutation({
    mutationFn: ({
      workflowId,
      state,
    }: {
      workflowId: string;
      state: TCollectionFlowState;
      action: 'step_request' | 'step_cancel';
    }) => {
      return updateCollectionFlowState(workflowId, state);
    },
    onSuccess: (_, { action }) => {
      toast.success(t(`toast:${action}.success`));
    },
    onError: (error, { action }) => {
      if (isErrorWithMessage(error)) {
        const translatedError = t(`toast:${action}.error`, {
          errorMessage: error.message,
        });

        toast.error(translatedError);
      } else {
        console.error(`Wrong exception type: ${error}`);
        toast.error(t(`toast:${action}.error_unknown`));
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries(collectionFlowQueryKeys._def);
    },
  });
};
