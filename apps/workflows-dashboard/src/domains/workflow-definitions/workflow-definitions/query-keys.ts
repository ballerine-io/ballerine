import {
  fetchUIDefinitionByWorkflowDefinitionId,
  fetchWorkflowDefinition,
  fetchWorkflowDefinitionsList,
} from '@/domains/workflow-definitions/workflow-definitions/workflow-definitions.api';
import {
  GetUIDefinitionQuery,
  GetWorkflowDefinitionDto,
  GetWorkflowDefinitionsListDto,
} from '@/domains/workflow-definitions/workflow-definitions/workflow-definitions.types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const workflowDefinitionsQueryKeys = createQueryKeys('workflowDefinitions', {
  get: (query: GetWorkflowDefinitionDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchWorkflowDefinition(query),
  }),
  list: (query: GetWorkflowDefinitionsListDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchWorkflowDefinitionsList(query),
  }),
  uiDefinition: (query: GetUIDefinitionQuery) => ({
    queryKey: [{ query }],
    queryFn: () => fetchUIDefinitionByWorkflowDefinitionId(query),
  }),
});
