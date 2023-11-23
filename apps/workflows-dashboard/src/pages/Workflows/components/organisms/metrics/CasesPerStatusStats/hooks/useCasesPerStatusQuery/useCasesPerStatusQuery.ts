import { ICasesPerStatusStats } from '@/domains/workflows/api/workflow-metrics';
import { workflowMetricsKeys } from '@/domains/workflows/api/workflow-metrics/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useCasesPerStatusQuery = () => {
  const { data = { active: 0, completed: 0, failed: 0 } as ICasesPerStatusStats, isLoading } =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useQuery({
      ...workflowMetricsKeys.workflowCasesPerStatusStats({}),
    });

  return {
    data,
    isLoading,
  };
};
