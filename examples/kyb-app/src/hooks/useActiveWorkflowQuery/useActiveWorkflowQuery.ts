import { collectionFlowQuerykeys } from '@app/domains/collection-flow';
import { workflowsQueryKeys } from '@app/domains/workflows';
import { useSessionQuery } from '@app/hooks/useSessionQuery';
import { useSignin } from '@app/hooks/useSignin';
import { useQuery } from '@tanstack/react-query';

export const useActiveWorkflowQuery = () => {
  const { user } = useSessionQuery();
  const { data: flowData, isFetching } = useQuery({
    ...collectionFlowQuerykeys.getFlowData({ endUserId: user?.id }),
    enabled: Boolean(user),
    staleTime: Infinity,
  });

  return {
    flowData,
    isFetching,
  };
};
