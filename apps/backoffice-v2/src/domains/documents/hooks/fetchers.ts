import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';

const DocumentTrackerItemSchema = z.object({
  documentId: z.string().nullable(),
  status: z.string(),
  decision: z.string().nullable(),
  properties: z.object({
    type: z.string(),
    templateId: z.string(),
    category: z.string(),
    issuingCountry: z.string(),
    issuingVersion: z.string(),
    version: z.string(),
  }),
  entity: z.object({
    entityType: z.string(),
    id: z.string(),
    companyName: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

const DocumentsTrackerSchema = z.object({
  business: z.array(DocumentTrackerItemSchema),
  individuals: z.object({
    ubos: z.array(DocumentTrackerItemSchema),
    directors: z.array(DocumentTrackerItemSchema),
  }),
});

export type TrackedDocument = z.infer<typeof DocumentTrackerItemSchema>;
export type DocumentsTracker = z.infer<typeof DocumentsTrackerSchema>;

export const fetchDocumentsTrackerItems = async ({
  workflowDefinitionId,
  workflowRuntimeDataId,
}: {
  workflowDefinitionId: string;
  workflowRuntimeDataId: string;
}) => {
  const [documentsTrackerItems, error] = await apiClient({
    endpoint: `../external/documents/tracker/${workflowDefinitionId}/${workflowRuntimeDataId}`,
    method: Method.GET,
    schema: DocumentsTrackerSchema,
  });

  return handleZodError(error, documentsTrackerItems);
};
