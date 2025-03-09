import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchDocumentsTrackerItems, getDocuments } from '@/domains/documents/fetchers';

export const documentsQueryKeys = createQueryKeys('documents', {
  list: ({ entityId, workflowId }: { entityId: string; workflowId: string }) => ({
    queryKey: [{ entityId, workflowId }],
    queryFn: () => getDocuments({ entityId, workflowId }),
  }),
  trackerItems: ({ workflowId }: { workflowId: string }) => ({
    queryKey: ['documents-tracker-items', workflowId],
    queryFn: () => fetchDocumentsTrackerItems({ workflowId }),
  }),
});
