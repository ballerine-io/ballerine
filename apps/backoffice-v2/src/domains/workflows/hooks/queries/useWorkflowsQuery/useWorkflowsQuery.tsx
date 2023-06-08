import { useQuery } from '@tanstack/react-query';

import { workflowsQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowsQuery = ({
  filterId,
  sortBy,
  sortDir,
  page,
  limit,
}: {
  filterId: string;
  sortBy: string;
  sortDir: string;
  page: number;
  limit: number;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...workflowsQueryKeys.list({ filterId, sortBy, sortDir, page, limit }),
    enabled: !!filterId && isAuthenticated && !!sortBy && !!sortDir && !!page && !!limit,
    staleTime: 100_000,
  });
};
