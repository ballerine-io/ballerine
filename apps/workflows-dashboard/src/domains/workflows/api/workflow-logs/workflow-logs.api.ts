import { request } from '@/lib/request';

export interface WorkflowLog {
  id: number;
  workflowRuntimeDataId: string;
  type: string;
  metadata: Record<string, any>;
  fromState: string | null;
  toState: string | null;
  message: string;
  eventName: string | null;
  pluginName: string | null;
  createdAt: string;
  projectId: string;
}

export interface GetWorkflowLogsResponse {
  data: WorkflowLog[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface GetWorkflowLogsParams {
  page?: number;
  pageSize?: number;
}

/**
 * Fetches logs for a specific workflow
 * @param workflowId - The ID of the workflow
 * @param params - Pagination parameters
 * @returns Promise with workflow logs data and pagination metadata
 */
export const fetchWorkflowLogs = async (
  workflowId: string,
  params: GetWorkflowLogsParams = {},
): Promise<GetWorkflowLogsResponse> => {
  const { page = 1, pageSize = 100 } = params;

  const result = await request.get<GetWorkflowLogsResponse>(`/workflow-logs/${workflowId}`, {
    params: {
      page,
      pageSize,
    },
  });

  return result.data;
};

export interface WorkflowLogSummary {
  typesCounts: Record<string, number>;
  totalLogs: number;
}

/**
 * Fetches a summary of logs for a specific workflow
 * @param workflowId - The ID of the workflow
 * @returns Promise with workflow log summary data
 */
export const fetchWorkflowLogSummary = async (workflowId: string): Promise<WorkflowLogSummary> => {
  const result = await request.get<WorkflowLogSummary>(`/workflow-logs/${workflowId}/summary`);

  return result.data;
};
