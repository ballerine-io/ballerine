import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { TWorkflowById, updateWorkflowDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';
import { Action } from '../../../../../common/enums';

export const useRevisionTaskByIdMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workflowId,
      documentId,
      reason,
      directorId,
      contextUpdateMethod,
    }: {
      workflowId: string;
      documentId: string;
      reason?: string;
      directorId?: string;
      contextUpdateMethod?: 'base' | 'director';
    }) =>
      updateWorkflowDecision({
        workflowId,
        documentId,
        contextUpdateMethod: contextUpdateMethod ?? 'base',
        body: {
          directorId,
          decision: Action.REVISION,
          reason,
        },
      }),
    onMutate: async ({ workflowId, documentId, reason }) => {
      const workflowById = workflowsQueryKeys.byId({ workflowId });
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
    onSuccess: () => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t(`toast:ask_revision_document.success`));
    },
    onError: (_error, variables, context) => {
      const workflowById = workflowsQueryKeys.byId({ workflowId: variables?.workflowId });

      toast.error(
        t(`toast:ask_revision_document.error`, {
          errorMessage: _error.message,
        }),
      );

      queryClient.setQueryData(workflowById.queryKey, context.previousWorkflow);
    },
  });
};
