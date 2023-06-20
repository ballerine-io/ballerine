import { apiClient } from '../../common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';
import { Method, States } from '../../common/enums';
import { IWorkflowId } from './interfaces';
import qs from 'qs';

export const fetchWorkflows = async (params: {
  filterId: string;
  orderBy: string;
  page: {
    number: number;
    size: number;
  };
  filter: Record<string, unknown>;
}) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [workflows, error] = await apiClient({
    endpoint: `workflows?${queryParams}`,
    method: Method.GET,
    schema: z.object({
      data: z.array(
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
      meta: z.object({
        totalItems: z.number().nonnegative(),
        totalPages: z.number().nonnegative(),
      }),
    }),
  });

  return handleZodError(error, workflows);
};

export const WorkflowByIdSchema = z.object({
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
    parentMachine: ObjectWithIdSchema.extend({
      status: z.union([z.literal('active'), z.literal('failed'), z.literal('completed')]),
    }).optional(),
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
});

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
    schema: WorkflowByIdSchema,
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
