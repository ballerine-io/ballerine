import { IWorkflowId } from '../api/interfaces';
import { apiClient } from '../api/api-client';
import { z } from 'zod';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '../lib/zod/utils/object-with-id/object-with-id';
import { Method } from '../enums';

export const fetchWorkflows = async () => {
  const [workflows, error] = await apiClient({
    endpoint: `workflows/active-states`,
    method: Method.GET,
    schema: z.array(
      ObjectWithIdSchema.extend({
        state: z.string().nullable(),
        endUserId: z.string().nullable(),
        businessId: z.string().nullable(),
        assigneeId: z.string().nullable(),
      }),
    ),
  });

  return handleZodError(error, workflows);
};

export const fetchWorkflowById = async ({ workflowId }: IWorkflowId) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}`,
    method: Method.GET,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const fetchUpdateWorkflowById = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body: Record<PropertyKey, unknown>;
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const fetchEvent = async ({
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
    endpoint: `workflows/${workflowId}/event`,
    method: Method.POST,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};
