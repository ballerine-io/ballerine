import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  fetchDocumentsByEntityIdsAndWorkflowId,
  fetchDocumentsTrackerItems,
  getDocumentsByEntityIdAndWorkflowId,
} from '@/domains/documents/fetchers';

export const documentsQueryKeys = createQueryKeys('documents', {
  listByEntityIdAndWorkflowId: ({
    entityId,
    workflowId,
  }: {
    entityId: string;
    workflowId: string;
  }) => ({
    queryKey: [{ entityId, workflowId }],
    queryFn: () => getDocumentsByEntityIdAndWorkflowId({ entityId, workflowId }),
  }),
  listByEntityIdsAndWorkflowId: ({
    entityIds,
    workflowId,
  }: {
    entityIds: string[];
    workflowId: string;
  }) => ({
    queryKey: [{ entityIds, workflowId }],
    queryFn: () => fetchDocumentsByEntityIdsAndWorkflowId({ entityIds, workflowId }),
  }),
  trackerItems: ({ workflowId }: { workflowId: string }) => ({
    queryKey: ['documents-tracker-items', workflowId],
    queryFn: () => fetchDocumentsTrackerItems({ workflowId }),
  }),
});
