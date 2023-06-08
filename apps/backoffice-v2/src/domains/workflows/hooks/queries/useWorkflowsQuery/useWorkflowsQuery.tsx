import { useQuery } from '@tanstack/react-query';

import { workflowsQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowsQuery = ({
  filterId,
  sortBy,
  sortDir,
  page,
  limit,
  filter,
}: {
  filterId: string;
  sortBy: string;
  sortDir: string;
  page: number;
  limit: number;
  filter: Record<string, unknown>;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...workflowsQueryKeys.list({ filterId, filter, sortBy, sortDir, page, limit }),
    enabled: !!filterId && isAuthenticated && !!sortBy && !!sortDir && !!page && !!limit,
    staleTime: 100_000,
  });
};
