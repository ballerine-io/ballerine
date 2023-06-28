import { useQuery } from '@tanstack/react-query';
import { workflowsQueryKeys } from '../../../query-keys';

export const useWorkflowQuery = ({
  workflowId,
  filterId,
  websocketConnectionIsOpen,
}: {
  workflowId: string;
  filterId: string;
  websocketConnectionIsOpen: boolean;
}) => {
  return useQuery({
    ...workflowsQueryKeys.byId({ workflowId, filterId }),
    enabled: !!filterId && !!workflowId,
    staleTime: 100_000,
    refetchInterval: () => (websocketConnectionIsOpen ? false : 10_000),
  });
};
