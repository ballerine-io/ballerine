import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { TWorkflowById, updateWorkflowDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { Action } from '../../../../../common/enums';
import { TObjectValues } from '../../../../../common/types';

export const useRevisionTaskByIdMutation = (workflowId: string, postUpdateEventName?: string) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const workflowById = workflowsQueryKeys.byId({ workflowId, filterId });

  return useMutation({
    mutationFn: ({
      documentId,
      decision,
      reason,
      contextUpdateMethod,
    }: {
      documentId: string;
      decision: TObjectValues<typeof Action> | null;
      reason?: string;
      contextUpdateMethod?: 'base' | 'director';
    }) =>
      updateWorkflowDecision({
        workflowId,
        documentId,
        contextUpdateMethod,
        body: {
          decision,
          reason,
          postUpdateEventName,
        },
      }),
    onMutate: async ({ documentId, reason }) => {
      await queryClient.cancelQueries({
        queryKey: workflowById.queryKey,
      });
      const previousWorkflow = queryClient.getQueryData(workflowById.queryKey);

      queryClient.setQueryData(workflowById.queryKey, (oldWorkflow: TWorkflowById) => {
        return {
          ...oldWorkflow,
          context: {
            ...oldWorkflow?.context,
            documents: oldWorkflow?.context?.documents?.map(document => {
              if (document?.id !== documentId) {
                return document;
              }

              return {
                ...document,
                decision: {
                  ...document?.decision,
                  status: 'revision',
                  revisionReason: reason,
                  rejectionReason: null,
                },
              };
            }),
          },
        };
      });

      return { previousWorkflow };
    },
    onSuccess: (_, { decision }) => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t(`toast:${decision ? 'ask_revision_document' : 'revert_revision'}.success`));
    },
    onError: (_error, _variables, context) => {
      toast.error(
        t(`toast:${_variables.decision ? 'ask_revision_document' : 'revert_revision'}.error`, {
          errorMessage: _error.message,
        }),
      );

      queryClient.setQueryData(workflowById.queryKey, context.previousWorkflow);
    },
  });
};
