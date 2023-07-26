import { workflowsQueryKeys } from '@app/domains/workflows/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useFlowDataQuery = (workflowId?: string) => {
  const { isLoading, data: flowData } = useQuery(workflowsQueryKeys.getFlowData({ workflowId }));

  return {
    isLoading,
    flowData,
  };
};
