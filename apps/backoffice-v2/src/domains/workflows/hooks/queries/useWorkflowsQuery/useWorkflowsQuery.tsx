import { useQuery } from '@tanstack/react-query';

import { workflowsQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowsQuery = ({
  filterId,
  sortBy,
  sortDir,
  page,
  pageSize,
  search,
  filter,
}: {
  filterId: string;
  sortBy: string;
  sortDir: string;
  page: number;
  pageSize: number;
  search: string;
  filter: Record<string, unknown>;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...workflowsQueryKeys.list({ filterId, filter, sortBy, sortDir, page, pageSize, search }),
    enabled: !!filterId && isAuthenticated && !!sortBy && !!sortDir && !!page && !!pageSize,
    staleTime: 100_000,
  });
};
