import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchDocumentsTrackerItems } from '@/domains/documents/fetchers';

export const documentsQueryKeys = createQueryKeys('documents', {
  trackerItems: ({ workflowId }: { workflowId: string }) => ({
    queryKey: ['documents-tracker-items', workflowId],
    queryFn: () => fetchDocumentsTrackerItems({ workflowId }),
  }),
});
