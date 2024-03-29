import { workflowMetricsKeys } from '@/domains/workflows/api/workflow-metrics/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useActivePerWorkflowStatsQuery = () => {
  const {
    data = [],
    isLoading,
    isFetching,
  } = useQuery(
    // @ts-ignore
    workflowMetricsKeys.workflowRuntimeStats(),
  );

  return {
    data,
    isFetching,
    isLoading,
  };
};
