import { useQuery } from '@tanstack/react-query';
import { workflowLogsQueryKeys } from '../../../query-keys';

export const useWorkflowLogs = ({
  workflowId,
  page = 1,
  pageSize = 50,
  types,
  orderBy = 'desc',
  enabled = true,
}: {
  workflowId: string;
  page?: number;
  pageSize?: number;
  types?: string[];
  orderBy?: 'asc' | 'desc';
  enabled?: boolean;
}) => {
  return useQuery({
    ...workflowLogsQueryKeys.byWorkflowId({ workflowId, page, pageSize, types, orderBy }),
    enabled: !!workflowId && enabled,
    staleTime: 30_000,
  });
};
