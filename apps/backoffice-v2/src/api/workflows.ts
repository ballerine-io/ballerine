import { endpoints } from './endpoints';
import { apiClient } from './api-client';
// import {
//   WorkflowByIdSchema,
//   WorkflowsListSchema,
// } from '@/lib/zod/schemas/workflows';
import { handleZodError } from '@/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';
import { IWorkflowId } from './interfaces';

export const workflows = {
  list: async () => {
    const [workflows, error] = await apiClient({
      endpoint: endpoints.workflows.list.endpoint(),
      method: endpoints.workflows.list.method,
      schema: z.any(),
    });

    return handleZodError(error, workflows);
  },
  byId: async ({ workflowId }: IWorkflowId) => {
    const [workflow, error] = await apiClient({
      endpoint: endpoints.workflows.byId.endpoint({ workflowId }),
      method: endpoints.workflows.byId.method,
      schema: z.any(),
    });

    return handleZodError(error, workflow);
  },
  updateById: async ({
    workflowId,
    body,
  }: IWorkflowId & {
    body: Record<PropertyKey, unknown>;
  }) => {
    const [workflow, error] = await apiClient({
      endpoint: endpoints.workflows.updateById.endpoint({ workflowId }),
      method: endpoints.workflows.updateById.method,
      body,
      schema: z.any(),
    });

    return handleZodError(error, workflow);
  },
  event: async ({
    workflowId,
    body,
  }: IWorkflowId & {
    body:
      | {
          name: string;
        }
      | {
          name: string;
          document: string;
          resubmissionReason: string;
        };
  }) => {
    const [workflow, error] = await apiClient({
      endpoint: endpoints.workflows.event.endpoint({ workflowId }),
      method: endpoints.workflows.event.method,
      body,
      schema: z.any(),
    });

    return handleZodError(error, workflow);
  },
};
