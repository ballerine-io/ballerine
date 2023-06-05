import { useQuery } from '@tanstack/react-query';

import { workflowsQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowsQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({ ...workflowsQueryKeys.list(), enabled: isAuthenticated });
};
