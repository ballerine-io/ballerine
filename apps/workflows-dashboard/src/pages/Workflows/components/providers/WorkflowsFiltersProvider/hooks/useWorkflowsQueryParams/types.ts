import { useWorkflowsQueryParams } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsQueryParams/useWorkflowsQueryParams';

export type WorkflowsQueryParams = ReturnType<typeof useWorkflowsQueryParams>['query'];
