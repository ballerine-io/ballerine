import { useQuery } from '@tanstack/react-query';

import { workflowsQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowsQuery = ({
  filterId,
  sortBy,
  sortDir,
}: {
  filterId: string;
  sortBy: string;
  sortDir: string;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...workflowsQueryKeys.list({ filterId, sortBy, sortDir }),
    enabled: !!filterId && isAuthenticated && Boolean(sortBy) && Boolean(sortDir),
    staleTime: 100_000,
  });
};
