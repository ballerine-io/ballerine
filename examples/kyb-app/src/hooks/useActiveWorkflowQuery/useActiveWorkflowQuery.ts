import { workflowsQueryKeys } from '@app/domains/workflows';
import { useSignin } from '@app/hooks/useSignin';
import { useQuery } from '@tanstack/react-query';

export const useActiveWorkflowQuery = () => {
  const { user } = useSignin();
  const { data: workflow, isFetching } = useQuery({
    ...workflowsQueryKeys.getFlowData({ email: user?.email }),
    enabled: Boolean(user),
    staleTime: Infinity,
  });

  return {
    workflow,
    isFetching,
  };
};
