import { apiClient } from '../../common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';
import { Method } from '../../common/enums';
import { IWorkflowId } from './interfaces';

export const fetchWorkflows = async () => {
  const [workflows, error] = await apiClient({
    endpoint: `workflows/active-states`,
    method: Method.GET,
    schema: z.array(
      ObjectWithIdSchema.extend({
        state: z.string().nullable(),
        status: z.union([z.literal('active'), z.literal('completed'), z.literal('failed')]),
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

export const updateWorkflowSetAssignById = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body: { assigneeId: string | null; isAssignedToMe?: boolean };
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/assign/${workflowId}`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const fetchWorkflowEvent = async ({
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
