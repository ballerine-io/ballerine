import { workflowMetricsKeys } from '@app/domains/workflows/api/workflow-metrics/query-keys';
import { useWorkflowFilters } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowFilters';
import { useQuery } from '@tanstack/react-query';

export const useAgentCasesStatsQuery = () => {
  const { filters } = useWorkflowFilters();
  const { data, isLoading } = useQuery(
    workflowMetricsKeys.workflowAgentCasesStats({ fromDate: filters.fromDate }),
  );

  return {
    data,
    isLoading,
  };
};
