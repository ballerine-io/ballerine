import { useQuery } from '@tanstack/react-query';

import { workflowsQueryKeys } from '../../../query-keys';

export const useWorkflowsQuery = (filterId: string) =>
  useQuery({
    ...workflowsQueryKeys.list(filterId),
    enabled: !!filterId,
    staleTime: 100_000,
  });
