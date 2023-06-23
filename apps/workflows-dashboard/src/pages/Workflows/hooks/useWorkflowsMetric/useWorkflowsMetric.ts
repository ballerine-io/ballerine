import { workflowMetricsKeys } from '@app/domains/workflows/api/workflow-metrics/query-keys';
import { WorkflowsMetric } from '@app/pages/Workflows/hooks/useWorkflowsMetric/types';
import { useQuery } from '@tanstack/react-query';

export function useWorkflowsMetric() {
  const { data, isLoading } = useQuery({
    ...workflowMetricsKeys.list(),
    keepPreviousData: true,
  });

  return {
    data: data ? (data as WorkflowsMetric) : null,
    isLoading,
  };
}
