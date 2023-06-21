import {
  GetWorkflowResponse,
  GetWorkflowsDto,
} from '@app/domains/workflows/api/workflow/workflow.types';
import { request } from '@app/lib/request';

export async function fetchWorkflows(query: GetWorkflowsDto): Promise<GetWorkflowResponse> {
  const result = await request.get<GetWorkflowResponse>('/external/workflows', {
    params: query,
  });

  return result.data;
}
