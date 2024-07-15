import { GetWorkflowDefinitionsListDto } from '@/domains/workflow-definitions/workflow-definitions/workflow-definitions.types';
import { IWorkflowDefinition } from '@/domains/workflows/api/workflow';
import { request } from '@/lib/request';

export const fetchWorkflowDefinitionsList = async (query: GetWorkflowDefinitionsListDto) => {
  const result = await request.get<IWorkflowDefinition[]>('/workflow-definitions', {
    params: query,
  });

  return result;
};
