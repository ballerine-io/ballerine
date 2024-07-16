import { useWorkflowsDefinitionQueryParams } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsDefinitionQueryParams/useWorkflowsDefinitionQueryParams';

export type WorkflowsDefinitionQueryParams = ReturnType<
  typeof useWorkflowsDefinitionQueryParams
>['query'];
