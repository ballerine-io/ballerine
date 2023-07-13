import { workflowMetricsKeys } from '@app/domains/workflows/api/workflow-metrics/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useActivePerWorkflowStatsQuery = () => {
  const { data = [], isLoading, isFetching } = useQuery(workflowMetricsKeys.workflowRuntimeStats());
  console.log('data', data);

  return {
    data,
    isFetching,
    isLoading,
  };
};
