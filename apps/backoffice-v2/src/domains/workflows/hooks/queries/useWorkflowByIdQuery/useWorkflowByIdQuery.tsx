import { useQuery } from '@tanstack/react-query';
import { workflowsQueryKeys } from '../../../query-keys';

export const useWorkflowByIdQuery = ({ workflowId }: { workflowId: string }) => {
  return useQuery({
    ...workflowsQueryKeys.byId({ workflowId }),
    enabled: !!workflowId,
    staleTime: 10_000,
  });
};
