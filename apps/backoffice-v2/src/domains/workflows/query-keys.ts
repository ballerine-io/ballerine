import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowById, fetchWorkflows } from './fetchers';

import { IWorkflowId } from './interfaces';

export const workflowsQueryKeys = createQueryKeys('workflows', {
  list: (filterId: string) => ({
    queryKey: [{ filterId }],
    queryFn: () => fetchWorkflows(filterId),
  }),
  byId: ({ workflowId }: IWorkflowId) => ({
    queryKey: [{ workflowId }],
    queryFn: () => fetchWorkflowById({ workflowId }),
  }),
});
