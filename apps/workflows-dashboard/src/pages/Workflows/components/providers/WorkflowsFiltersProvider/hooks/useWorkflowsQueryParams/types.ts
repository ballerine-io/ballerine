import { useWorkflowsQueryParams } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowsQueryParams/useWorkflowsQueryParams';

export type WorkflowsQueryParams = ReturnType<typeof useWorkflowsQueryParams>['query'];
