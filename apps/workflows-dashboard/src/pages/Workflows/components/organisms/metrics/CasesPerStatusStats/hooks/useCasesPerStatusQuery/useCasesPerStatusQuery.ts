import { ICasesPerStatusStats } from '@app/domains/workflows/api/workflow-metrics';
import { workflowMetricsKeys } from '@app/domains/workflows/api/workflow-metrics/query-keys';
import { useWorkflowFilters } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/hooks/useWorkflowFilters';
import { useQuery } from '@tanstack/react-query';

export const useCasesPerStatusQuery = () => {
  const { filters } = useWorkflowFilters();
  const { data = { active: 0, completed: 0, failed: 0 } as ICasesPerStatusStats, isLoading } =
    useQuery({
      ...workflowMetricsKeys.workflowCasesPerStatusStats({ fromDate: filters.fromDate! }),
      enabled: Boolean(filters.fromDate),
    });

  return {
    data,
    isLoading,
  };
};
