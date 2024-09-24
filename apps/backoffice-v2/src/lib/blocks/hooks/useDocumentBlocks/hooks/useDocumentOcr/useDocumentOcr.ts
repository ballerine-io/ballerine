import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflowDocumentOCRResult } from '@/domains/workflows/fetchers';
import { toast } from 'sonner';
import { t } from 'i18next';

export const useDocumentOrc = ({
  workflowId,
  onSuccess,
}: {
  workflowId: string;
  onSuccess: (ocrProperties: Record<string, unknown>, document: { documentId: string }) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId }: { documentId: string }) =>
      fetchWorkflowDocumentOCRResult({
        workflowDefinitionId: workflowId,
        documentId,
      }),
    onSuccess: (data, variables, context) => {
      onSuccess(data, variables);
    },
    onError: (_error, _variables, context) => {
      console.error(_error);
      toast.error(t('toast:document_ocr.error'));
    },
  });
};
