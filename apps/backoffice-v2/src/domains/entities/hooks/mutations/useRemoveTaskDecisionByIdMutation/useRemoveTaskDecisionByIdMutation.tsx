import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { TWorkflowById, updateWorkflowDecision } from '../../../../workflows/fetchers';
import { workflowsQueryKeys } from '../../../../workflows/query-keys';

export const useRemoveTaskDecisionByIdMutation = (workflowId: string) => {
  const queryClient = useQueryClient();
  const workflowById = workflowsQueryKeys.byId({ workflowId });

  return useMutation({
    mutationFn: ({
      documentId,
      directorId,
      contextUpdateMethod,
    }: {
      documentId: string;
      directorId?: string;
      contextUpdateMethod: 'base' | 'director';
    }) =>
      updateWorkflowDecision({
        workflowId,
        documentId,
        body: {
          directorId,
          decision: null,
          reason: null,
        },
        contextUpdateMethod,
      }),
    onMutate: async ({ documentId }) => {
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
                  status: null,
                  revisionReason: null,
                  rejectionReason: null,
                },
              };
            }),
          },
        };
      });

      return { previousWorkflow };
    },
    onSuccess: _ => {
      // workflowsQueryKeys._def is the base key for all workflows queries
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.success(t(`toast:revert_revision.success`));
    },
    onError: (_error, _variables, context) => {
      toast.error(t(`toast:revert_revision.error`, { errorMessage: _error.message }));

      queryClient.setQueryData(workflowById.queryKey, context.previousWorkflow);
    },
  });
};
