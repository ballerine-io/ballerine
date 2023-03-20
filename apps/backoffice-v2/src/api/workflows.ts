import { endpoints } from './endpoints';
import { apiClient } from './api-client';
// import {
//   WorkflowByIdSchema,
//   WorkflowsListSchema,
// } from '../lib/zod/schemas/workflows';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';
import { IEndUserIdAndWorkflowId } from './interfaces';

export const workflows = {
  list: async () => {
    const [workflows, error] = await apiClient({
      endpoint: endpoints.workflows.list.endpoint(),
      method: endpoints.workflows.list.method,
      schema: z.any(),
    });

    return handleZodError(error, workflows);
  },
  byId: async ({ workflowId }: { workflowId: string }) => {
    const [workflow, error] = await apiClient({
      endpoint: endpoints.workflows.byId.endpoint({ workflowId }),
      method: endpoints.workflows.byId.method,
      schema: z.any(),
    });

    return handleZodError(error, workflow);
  },
  updateById: async ({
    endUserId,
    workflowId,
    body,
  }: IEndUserIdAndWorkflowId & {
    body: Record<PropertyKey, unknown>;
  }) => {
    const [workflow, error] = await apiClient({
      endpoint: endpoints.workflows.updateById.endpoint({ endUserId, workflowId }),
      method: endpoints.workflows.updateById.method,
      body,
      schema: z.any(),
    });

    return handleZodError(error, workflow);
  },
  event: async ({
    endUserId,
    workflowId,
    body,
  }: IEndUserIdAndWorkflowId & {
    body: Record<PropertyKey, unknown>;
  }) => {
    const [workflow, error] = await apiClient({
      endpoint: endpoints.workflows.event.endpoint({ endUserId, workflowId }),
      method: endpoints.workflows.event.method,
      body,
      schema: z.any(),
    });

    return handleZodError(error, workflow);
  },
};
