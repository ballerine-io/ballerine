import { useQuery } from '@tanstack/react-query';
import { workflowsQueryKeys } from '../../../query-keys';

export const useWorkflowByIdQuery = ({
  workflowId,
  filterId,
}: {
  workflowId: string;
  filterId: string;
}) => {
  return useQuery({
    ...workflowsQueryKeys.byId({ workflowId, filterId }),
    enabled: !!filterId && !!workflowId,
    staleTime: 10_000,
  });
};
