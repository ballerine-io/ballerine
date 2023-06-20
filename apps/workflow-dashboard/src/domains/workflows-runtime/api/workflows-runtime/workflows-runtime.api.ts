import {
  GetWorkflowRuntimeResponse,
  GetWorkflowsRuntimeDto,
} from '@app/domains/workflows-runtime/api/workflows-runtime/workflows-runtime.types';
import { request } from '@app/lib/request';

export async function fetchWorkflowsRuntime(
  query: GetWorkflowsRuntimeDto,
): Promise<GetWorkflowRuntimeResponse> {
  const result = await request.get<GetWorkflowRuntimeResponse>('/workflow-runtime', {
    params: query,
  });

  return result.data;
}
