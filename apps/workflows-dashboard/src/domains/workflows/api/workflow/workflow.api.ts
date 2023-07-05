import { SortingParams } from '@app/common/types/sorting-params.types';
import {
  GetWorkflowResponse,
  GetWorkflowsDto,
} from '@app/domains/workflows/api/workflow/workflow.types';
import { request } from '@app/lib/request';

export async function fetchWorkflows(
  query: GetWorkflowsDto,
  sortingParams: SortingParams,
): Promise<GetWorkflowResponse> {
  const result = await request.get<GetWorkflowResponse>('/external/workflows', {
    params: {
      ...query,
      ...sortingParams,
    },
  });

  return result.data;
}
