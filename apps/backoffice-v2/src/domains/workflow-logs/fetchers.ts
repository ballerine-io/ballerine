import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { z } from 'zod';

export const WorkflowLogSchema = z.object({
  id: z.number(),
  workflowRuntimeDataId: z.string(),
  type: z.enum([
    'EVENT_RECEIVED',
    'STATE_TRANSITION',
    'PLUGIN_INVOCATION',
    'CONTEXT_CHANGED',
    'ERROR',
    'INFO',
  ]),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  fromState: z.string().nullable().optional(),
  toState: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  eventName: z.string().nullable().optional(),
  pluginName: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});

export type TWorkflowLog = z.output<typeof WorkflowLogSchema>;

const WorkflowLogsResponseSchema = z.object({
  data: z.array(WorkflowLogSchema),
  meta: z.object({
    total: z.number(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
  }),
});

export type TWorkflowLogsResponse = z.output<typeof WorkflowLogsResponseSchema>;

export const fetchWorkflowLogs = async ({
  workflowId,
  page = 1,
  pageSize = 50,
  types,
  orderBy = 'desc',
}: {
  workflowId: string;
  page?: number;
  pageSize?: number;
  types?: string[];
  orderBy?: 'asc' | 'desc';
}) => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  params.set('orderBy', orderBy);

  if (types?.length) {
    types.forEach(t => params.append('types', t));
  }

  const [response, error] = await apiClient({
    endpoint: `../workflow-logs/${workflowId}?${params.toString()}`,
    method: Method.GET,
    schema: WorkflowLogsResponseSchema,
  });

  return handleZodError(error, response);
};

const WorkflowLogSummarySchema = z.object({
  data: z.record(z.string(), z.number()),
});

export const fetchWorkflowLogSummary = async ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const [response, error] = await apiClient({
    endpoint: `../workflow-logs/summary/${workflowId}`,
    method: Method.GET,
    schema: WorkflowLogSummarySchema,
  });

  return handleZodError(error, response);
};
