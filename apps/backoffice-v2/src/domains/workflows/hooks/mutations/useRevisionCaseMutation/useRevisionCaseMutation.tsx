import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { fetchCaseRevisionForDocuments } from '../../../fetchers';
import { workflowsQueryKeys } from '../../../query-keys';
import { collectionFlowQueryKeys } from '@/domains/collection-flow/query-keys';
import { documentsQueryKeys } from '@/domains/documents/hooks/query-keys';

export const useRevisionCaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workflowId, documentIds }: { workflowId: string; documentIds: string[] }) =>
      fetchCaseRevisionForDocuments({
        workflowId,
        documentIds,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries(workflowsQueryKeys._def);
      void queryClient.invalidateQueries(collectionFlowQueryKeys._def);
      void queryClient.invalidateQueries(documentsQueryKeys._def);

      toast.success(t(`toast:ask_revision_case.success`));
    },
    onError: () => {
      toast.error(t(`toast:ask_revision_case.error`));
    },
  });
};
