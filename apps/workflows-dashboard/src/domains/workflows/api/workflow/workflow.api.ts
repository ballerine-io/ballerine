import { SortingParams } from '@/common/types/sorting-params.types';
import {
  GetWorkflowResponse,
  GetWorkflowsDto,
  SendWorkflowEventDto,
  UpdateWorkflowStateDto,
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

export const updateWorkflowState = async (dto: UpdateWorkflowStateDto) => {
  const result = await request.patch(`/external/workflows/${dto.workflowId}`, {
    state: dto.state,
    tags: [dto.state],
  });

  return result.data;
};

export const sendWorkflowEvent = async (dto: SendWorkflowEventDto) => {
  const result = await request.post(`/external/workflows/${dto.workflowId}/event`, {
    name: dto.name,
  });

  return result.data;
};
