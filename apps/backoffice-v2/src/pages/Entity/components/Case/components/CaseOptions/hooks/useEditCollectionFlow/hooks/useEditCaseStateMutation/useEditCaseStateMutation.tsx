import { workflowsQueryKeys } from '@/domains/workflows/query-keys';

import { queryClient } from '@/lib/react-query/query-client';

import { Action } from '@/common/enums';
import { fetchWorkflowEvent } from '@/domains/workflows/fetchers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';

export const useEditCaseStateMutation = () => {
  return useMutation({
    mutationFn: ({ workflowId }: { workflowId: string }) =>
      fetchWorkflowEvent({
        workflowId,
        body: {
          name: Action.EDIT_COLLECTION_FLOW,
        },
      }),
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t(`toast:edit_case_state.success`));
    },
    onError: () => {
      toast.error(t(`toast:edit_case_state.error`));
    },
  });
};
