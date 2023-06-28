import { useQuery } from '@tanstack/react-query';

import { workflowsQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowsQuery = ({
  filterId,
  sortBy,
  sortDir,
  page,
  pageSize,
  websocketConnectionIsOpen,
  filter,
}: {
  filterId: string;
  sortBy: string;
  sortDir: string;
  page: number;
  pageSize: number;
  websocketConnectionIsOpen: boolean;
  filter: Record<string, unknown>;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...workflowsQueryKeys.list({ filterId, filter, sortBy, sortDir, page, pageSize }),
    enabled: !!filterId && isAuthenticated && !!sortBy && !!sortDir && !!page && !!pageSize,
    staleTime: 100_000,
    refetchInterval: () => (websocketConnectionIsOpen ? false : 100_000),
  });
};
