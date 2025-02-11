import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchDocumentsTrackerItems } from '@/domains/documents/hooks/fetchers';

export const documentsQueryKey = createQueryKeys('documents', {
  trackerItems: ({ workflowId }: { workflowId: string }) => ({
    queryKey: ['documents-tracker-items', workflowId],
    queryFn: () => fetchDocumentsTrackerItems({ workflowId }),
  }),
});
