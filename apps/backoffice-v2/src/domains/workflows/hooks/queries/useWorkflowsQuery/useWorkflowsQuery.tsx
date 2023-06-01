import { useQuery } from '@tanstack/react-query';

import { workflowsQueryKeys } from '../../../query-keys';

export const useWorkflowsQuery = () => {
  return useQuery({ ...workflowsQueryKeys.list() });
};
