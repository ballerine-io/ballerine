import { SortingParams } from '@/common/types/sorting-params.types';
import {
  GetWorkflowDefinitionDto,
  GetWorkflowDefinitionResponse,
  GetWorkflowResponse,
  GetWorkflowsDto,
  IWorkflowDefinition,
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

export const fetchWorkflowDefinition = async (
  query: GetWorkflowDefinitionDto,
): Promise<IWorkflowDefinition> => {
  const result = await request.get<GetWorkflowDefinitionResponse>(
    `/external/workflows/workflow-definition/${query.workflowId}`,
  );

  return result.data?.definition || {};
};
