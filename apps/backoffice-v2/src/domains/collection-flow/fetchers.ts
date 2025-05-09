import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { CollectionFlowStateSchema, TCollectionFlowState } from './schemas';
import { z } from 'zod';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

const FetchCollectionFlowStateResponseSchema = z.object({
  state: CollectionFlowStateSchema.nullable(),
});

export const fetchCollectionFlowState = async (workflowId: string) => {
  const [result, error] = await apiClient({
    endpoint: `../external/workflows/collection-flow/${workflowId}/state`,
    method: Method.GET,
    schema: FetchCollectionFlowStateResponseSchema,
  });

  return handleZodError(error, result);
};

export const updateCollectionFlowState = async (
  workflowId: string,
  state: TCollectionFlowState,
) => {
  const [result, error] = await apiClient({
    endpoint: `../external/workflows/collection-flow/${workflowId}/state`,
    method: Method.PUT,
    schema: CollectionFlowStateSchema,
    body: state,
  });

  return handleZodError(error, result);
};
