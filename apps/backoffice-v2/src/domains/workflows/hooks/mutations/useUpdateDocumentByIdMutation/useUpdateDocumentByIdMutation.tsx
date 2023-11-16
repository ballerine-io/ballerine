import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { TWorkflowById, updateWorkflowDocumentById } from '../../../fetchers';
import { useFilterId } from '../../../../../common/hooks/useFilterId/useFilterId';
import { workflowsQueryKeys } from '../../../query-keys';

export const useUpdateDocumentByIdMutation = ({
  workflowId,
  documentId,
}: {
  workflowId: string;
  documentId: string;
  isDirector?: boolean;
}) => {
  const queryClient = useQueryClient();
  const filterId = useFilterId();
  const workflowById = workflowsQueryKeys.byId({ workflowId, filterId });

  return useMutation({
    mutationFn: ({
      document,
      isDirector,
    }: {
      document: Record<PropertyKey, unknown>;
      action: 'update_document_properties';
      isDirector?: boolean;
    }) =>
      updateWorkflowDocumentById({
        workflowId,
        documentId,
        body: {
          document,
        },
        isDirector,
      }),
    onMutate: async ({ document }) => {
      await queryClient.cancelQueries({
        queryKey: workflowById.queryKey,
      });
      const previousWorkflow = queryClient.getQueryData(workflowById.queryKey);

      queryClient.setQueryData(workflowById.queryKey, (oldWorkflow: TWorkflowById) => {
        return {
          ...oldWorkflow,
          context: {
            ...oldWorkflow.context,
            documents: oldWorkflow.context.documents.map((doc: { id: string }) => {
              if (doc.id === documentId) {
                return document;
              }
              return doc;
            }),
          },
        };
      });

      return { previousWorkflow };
    },
    onSuccess: (data, { action }) => {
      toast.success(t(`toast:${action}.success`));
    },
    onError: (error, { action }, context) => {
      toast.error(t(`toast:${action}.error`, { errorMessage: error.message }));
      queryClient.setQueryData(workflowById.queryKey, context.previousWorkflow);
    },
    onSettled: () => {
      void queryClient.invalidateQueries();
    },
  });
};
