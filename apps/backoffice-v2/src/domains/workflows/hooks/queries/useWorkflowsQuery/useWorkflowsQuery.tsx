import {useQuery, useQueryClient} from '@tanstack/react-query';

import {getPaginationMeta, workflowsQueryKeys} from '../../../query-keys';
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
  const client = useQueryClient();

  const query =  useQuery({
    ...workflowsQueryKeys.list({ filterId, filter, sortBy, sortDir, page, pageSize, search }, client),
    // TODO: in React-Query V5 the client is passed as part of QueryFnContext. Remove the param once we upgrade to v5.
    enabled: !!filterId && isAuthenticated && !!sortBy && !!sortDir && !!page && !!pageSize,
    staleTime: 100_000,
  });

  return { ...query, meta: getPaginationMeta(client) }
};
