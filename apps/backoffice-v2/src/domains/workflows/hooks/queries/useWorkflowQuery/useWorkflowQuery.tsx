import { useQuery } from '@tanstack/react-query';
import { workflowsQueryKeys } from '../../../query-keys';

export const useWorkflowQuery = ({
  workflowId,
  filterId,
}: {
  workflowId: string;
  filterId: string;
}) => {
  return useQuery({
    ...workflowsQueryKeys.list(filterId),
    enabled: !!filterId,
    staleTime: 10_000,
    select: workflows => workflows.find(workflow => workflow.id === workflowId),
  });
};
