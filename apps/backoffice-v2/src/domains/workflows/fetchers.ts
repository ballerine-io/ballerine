import { apiClient } from '../../common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';
import { Method, States } from '../../common/enums';
import { IWorkflowId } from './interfaces';

export const fetchWorkflows = async (filterId: string) => {
  const [workflows, error] = await apiClient({
    endpoint: `workflows?filterId=${filterId}`,
    method: Method.GET,
    schema: z.array(
      z.object({
        id: z.string(),
        status: z.string(),
        createdAt: z.string().datetime(),
        entity: ObjectWithIdSchema.extend({
          name: z.string(),
          avatarUrl: z.string().nullable(),
          approvalState: z.enum(States),
        }),
        assignee: ObjectWithIdSchema.extend({
          firstName: z.string(),
          lastName: z.string(),
        }).nullable(),
      }),
    ),
  });

  return handleZodError(error, workflows);
};

export const fetchWorkflowById = async ({
  workflowId,
  filterId,
}: {
  workflowId: string;
  filterId: string;
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}?filterId=${filterId}`,
    method: Method.GET,
    schema: z.object({
      id: z.string(),
      status: z.string(),
      nextEvents: z.array(z.any()),
      workflowDefinition: ObjectWithIdSchema.extend({
        name: z.string(),
        contextSchema: z.record(z.any(), z.any()).nullable(),
        config: z.record(z.any(), z.any()).nullable(),
      }),
      createdAt: z.string().datetime(),
      context: z.object({
        documents: z.array(z.any()),
        entity: z.record(z.any(), z.any()),
      }),
      entity: ObjectWithIdSchema.extend({
        name: z.string(),
        avatarUrl: z.string().nullable(),
        approvalState: z.enum(States),
      }),
      assignee: ObjectWithIdSchema.extend({
        firstName: z.string(),
        lastName: z.string(),
      }).nullable(),
    }),
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
