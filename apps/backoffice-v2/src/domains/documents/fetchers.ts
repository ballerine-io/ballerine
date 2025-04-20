import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { DocumentsTrackerSchema, RequestDocumentsSchema } from './schemas';
import { z } from 'zod';

export const fetchDocumentsTrackerItems = async ({ workflowId }: { workflowId: string }) => {
  const [documentsTrackerItems, error] = await apiClient({
    endpoint: `../external/documents/tracker/${workflowId}`,
    method: Method.GET,
    schema: DocumentsTrackerSchema,
  });

  return handleZodError(error, documentsTrackerItems);
};

export const requestDocumentsUpload = async (body: z.infer<typeof RequestDocumentsSchema>) => {
  const [documentsTrackerItems, error] = await apiClient({
    endpoint: '../external/documents/request-upload',
    method: Method.POST,
    body,
    schema: z.object({
      message: z.string(),
      count: z.number(),
    }),
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
    schema: z.array(z.record(z.string(), z.any())),
  });

  return handleZodError(error, documents);
};

export const updateDocumentsDecisionByIds = async ({
  ids,
  data,
}: {
  ids: string[];
  data: {
    decision: 'approve' | 'reject' | 'revision' | null;
  };
}) => {
  const [documents, error] = await apiClient({
    endpoint: `../external/documents/decision/batch`,
    method: Method.PATCH,
    body: {
      ids,
      decision: data.decision,
    },
    schema: z.array(z.record(z.string(), z.any())),
  });

  return handleZodError(error, documents);
};

export const updateDocumentById = async ({
  documentId,
  data,
}: {
  documentId: string;
  data: {
    type: string;
    category: string;
    properties: Record<PropertyKey, unknown>;
  };
}) => {
  const [documents, error] = await apiClient({
    endpoint: `../external/documents/${documentId}`,
    method: Method.PATCH,
    body: data,
    schema: z.array(z.record(z.string(), z.any())),
  });

  return handleZodError(error, documents);
};
export const getDocumentsByEntityIdAndWorkflowId = async ({
  entityId,
  workflowId,
}: {
  entityId: string;
  workflowId: string;
}) => {
  const [documents, error] = await apiClient({
    method: Method.GET,
    endpoint: `../external/documents/${entityId}/${workflowId}`,
    schema: z.array(z.record(z.string(), z.any())),
    timeout: 30000,
  });

  return handleZodError(error, documents);
};

export const fetchDocumentsByEntityIdsAndWorkflowId = async ({
  entityIds,
  workflowId,
}: {
  entityIds: string[];
  workflowId: string;
}) => {
  const [documents, error] = await apiClient({
    method: Method.GET,
    endpoint: `../external/documents/by-entity-ids/${entityIds.join(',')}/${workflowId}`,
    schema: z.array(z.record(z.string(), z.any())),
  });

  return handleZodError(error, documents);
};
