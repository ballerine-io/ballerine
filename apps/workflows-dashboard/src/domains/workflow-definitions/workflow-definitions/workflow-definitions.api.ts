import {
  GetUIDefinitionQuery,
  GetWorkflowDefinitionDto,
  GetWorkflowDefinitionsListDto,
  IWorkflowDefinition,
  UpdateWorkflowDefinitionByIdDto,
  UpdateWorkflowDefinitionExtensionsByIdDto,
} from '@/domains/workflow-definitions/workflow-definitions/workflow-definitions.types';
import { request } from '@/lib/request';

export interface IFetchWorkflowDefinitionsListResponse {
  items: IWorkflowDefinition[];
  meta: {
    total: number;
    pages: number;
  };
}

export const fetchWorkflowDefinitionsList = async (query: GetWorkflowDefinitionsListDto) => {
  const result = await request.get<IFetchWorkflowDefinitionsListResponse>('/workflow-definition', {
    params: query,
  });

  return result.data;
};

export const fetchWorkflowDefinition = async (
  query: GetWorkflowDefinitionDto,
): Promise<IWorkflowDefinition> => {
  const result = await request.get<IWorkflowDefinition>(
    `/external/workflows/workflow-definition/${query.workflowDefinitionId}`,
  );

  return result.data || {};
};

export const fetchUIDefinitionByWorkflowDefinitionId = async (query: GetUIDefinitionQuery) => {
  const result = await request.get<object>(
    `/internal/ui-definition/workflow-definition/${query.workflowDefinitionId}?uiContext=collection-flow`,
  );

  return result.data || {};
};

export const updateWorkflowDefinitionById = async (dto: UpdateWorkflowDefinitionByIdDto) => {
  const result = await request.put(`/workflow-definition/${dto.workflowDefinitionId}/definition`, {
    definition: dto.definition,
  });

  return result.data;
};

export const updateWorkflowDefinitionExtensionsById = async (
  dto: UpdateWorkflowDefinitionExtensionsByIdDto,
) => {
  const result = await request.put(`/workflow-definition/${dto.workflowDefinitionId}/extensions`, {
    extensions: dto.extensions,
  });

  return result.data;
};
