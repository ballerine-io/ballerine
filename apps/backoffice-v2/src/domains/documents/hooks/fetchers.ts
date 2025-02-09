import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';

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
    schema: z.object({
      business: z.array(z.record(z.string(), z.any())),
      individuals: z.object({
        ubos: z.array(z.record(z.string(), z.any())),
        directors: z.array(z.record(z.string(), z.any())),
      }),
    }),
  });

  return handleZodError(error, documentsTrackerItems);
};
