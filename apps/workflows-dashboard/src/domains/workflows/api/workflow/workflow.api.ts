import { SortingParams } from '@/common/types/sorting-params.types';
import {
  GetWorkflowResponse,
  GetWorkflowsDto,
} from '@/domains/workflows/api/workflow/workflow.types';
import { request } from '@/lib/request';

export const fetchWorkflows = async (
  query: GetWorkflowsDto,
  sortingParams: SortingParams,
): Promise<GetWorkflowResponse> => {
  const result = await request.get<GetWorkflowResponse>('/external/workflows', {
    params: {
      ...query,
      ...sortingParams,
    },
  });

  return result.data;
};
