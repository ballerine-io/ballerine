import { useWorkflowsQueryParams } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsQueryParams/useWorkflowsQueryParams';

export type WorkflowsDefinitionQueryParams = ReturnType<typeof useWorkflowsQueryParams>['query'];
