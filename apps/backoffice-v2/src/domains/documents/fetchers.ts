import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { DocumentsTrackerSchema } from './hooks/schemas/document';

export const fetchDocumentsTrackerItems = async ({ workflowId }: { workflowId: string }) => {
  const [documentsTrackerItems, error] = await apiClient({
    endpoint: `../external/documents/tracker/${workflowId}`,
    method: Method.GET,
    schema: DocumentsTrackerSchema,
  });

  return handleZodError(error, documentsTrackerItems);
};

export const requestDocumentsUpload = async (body: { documentIds: string[] }) => {
  const [documentsTrackerItems, error] = await apiClient({
    endpoint: '../external/documents/request-upload',
    method: Method.POST,
    body,
    schema: DocumentsTrackerSchema,
  });

  return handleZodError(error, documentsTrackerItems);
};
