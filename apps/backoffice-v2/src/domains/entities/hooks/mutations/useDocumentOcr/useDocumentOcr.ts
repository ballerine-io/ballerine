import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflowDocumentOCRResult } from '@/domains/workflows/fetchers';
import { toast } from 'sonner';
import { t } from 'i18next';
import { workflowsQueryKeys } from '@/domains/workflows/query-keys';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';

export const useDocumentOrc = ({
  workflowId,
  onSuccess,
}: {
  workflowId: string;
  onSuccess: (ocrProperties: Record<string, unknown>, document: { documentId: string }) => void;
}) => {
  const filterId = useFilterId();
  const workflowById = workflowsQueryKeys.byId({ workflowId, filterId });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId }: { documentId: string }) =>
      fetchWorkflowDocumentOCRResult({
        workflowDefinitionId: workflowId,
        documentId,
      }),
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      toast.error(t('toast:document_ocr.success'));

      onSuccess(data, variables);
    },
    onError: (_error, _variables) => {
      console.error(_error);
      void queryClient.invalidateQueries(workflowsQueryKeys._def);
      toast.error(t('toast:document_ocr.error'));
    },
  });
};
