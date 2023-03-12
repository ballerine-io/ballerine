import { createQueryKeys } from '@lukemorales/query-key-factory';
import { IEndUserIdAndWorkflowId } from 'src/api/interfaces';
import { api } from '../../api/api';

export const workflows = createQueryKeys('workflows', {
  list: (endUserId: string) => ({
    queryKey: [endUserId],
    queryFn: () => api.workflows.list(endUserId),
  }),
  byId: ({ endUserId, workflowId }: IEndUserIdAndWorkflowId) => ({
    queryKey: [endUserId, workflowId],
    queryFn: () => api.workflows.byId({ endUserId, workflowId }),
  }),
});
