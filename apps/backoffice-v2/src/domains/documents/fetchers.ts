import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { DocumentsTrackerSchema } from './hooks/schemas/document';
import { z } from 'zod';

export const fetchDocumentsTrackerItems = async ({ workflowId }: { workflowId: string }) => {
  const [documentsTrackerItems, error] = await apiClient({
    endpoint: `../external/documents/tracker/${workflowId}`,
    method: Method.GET,
    schema: DocumentsTrackerSchema,
  });

  return handleZodError(error, documentsTrackerItems);
};

export const requestDocumentsUpload = async (body: {
  workflowId: string;
  identifiers: Array<{
    document: {
      type: string;
      category: string;
      issuingCountry: string;
      issuingVersion: string;
      version: string;
    };
    entity: {
      id: string;
    };
  }>;
}) => {
  const [documentsTrackerItems, error] = await apiClient({
    endpoint: '../external/documents/request-upload',
    method: Method.POST,
    body,
    schema: DocumentsTrackerSchema,
  });

  return handleZodError(error, documentsTrackerItems);
};

export const updateDocumentDecisionById = async ({
  documentId,
  data,
}: {
  documentId: string;
  data: {
    decision: 'approve' | 'reject' | 'revision' | null;
    decisionReason?: string;
    comment?: string;
  };
}) => {
  const [documents, error] = await apiClient({
    endpoint: `../external/documents/${documentId}/decision`,
    method: Method.PATCH,
    body: data,
    schema: z.any(),
  });

  return handleZodError(error, documents);
};
