import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchWorkflowById, fetchWorkflows } from './fetchers';
import { IWorkflowId } from '../api/interfaces';

export const workflowsQueryKeys = createQueryKeys('workflows', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => fetchWorkflows(),
  }),
  byId: ({ workflowId }: IWorkflowId) => ({
    queryKey: [{ workflowId }],
    queryFn: () => fetchWorkflowById({ workflowId }),
  }),
});
