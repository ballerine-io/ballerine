import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchDocumentsTrackerItems } from '@/domains/documents/hooks/fetchers';

export const documentsQueryKey = createQueryKeys('documents', {
  trackerItems: ({
    workflowDefinitionId,
    workflowRuntimeDataId,
  }: {
    workflowDefinitionId: string;
    workflowRuntimeDataId: string;
  }) => ({
    queryKey: ['documents-tracker-items', workflowDefinitionId, workflowRuntimeDataId],
    queryFn: () => fetchDocumentsTrackerItems({ workflowDefinitionId, workflowRuntimeDataId }),
  }),
});
