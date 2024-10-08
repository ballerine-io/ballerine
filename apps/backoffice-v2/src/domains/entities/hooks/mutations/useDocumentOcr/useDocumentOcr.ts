import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflowDocumentOCRResult } from '@/domains/workflows/fetchers';
import { toast } from 'sonner';
import { t } from 'i18next';
import { workflowsQueryKeys } from '@/domains/workflows/query-keys';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { isEmptyObject } from '@ballerine/common';

export const useDocumentOcr = ({ workflowId }: { workflowId: string }) => {
  const filterId = useFilterId();
  const workflowById = workflowsQueryKeys.byId({ workflowId, filterId });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId }: { documentId: string }) => {
      return fetchWorkflowDocumentOCRResult({
        workflowRuntimeId: workflowId,
        documentId,
      });
    },
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries(workflowsQueryKeys._def);

      if (
        !data.parsedData ||
        isEmptyObject(data.parsedData) ||
        Object.entries(data.parsedData).filter(([_, value]) => {
          return !(typeof value === 'string' && value.trim() === '');
          //TODO fix this logic
        }).length === 0
      ) {
        toast.success(t('toast:document_ocr.empty_extraction'));
      }

      toast.success(t('toast:document_ocr.success'));
    },
    onError: (error, variables) => {
      console.error('OCR error:', error, 'for document:', variables.documentId);
      void queryClient.invalidateQueries(workflowsQueryKeys._def);
      toast.error(t('toast:document_ocr.error'));
    },
  });
};
