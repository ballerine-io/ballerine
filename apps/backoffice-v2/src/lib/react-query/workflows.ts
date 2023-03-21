import { createQueryKeys } from '@lukemorales/query-key-factory';
import { IWorkflowId } from '../../api/interfaces';
import { api } from '../../api/api';

export const workflows = createQueryKeys('workflows', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => api.workflows.list(),
  }),
  byId: ({ workflowId }: IWorkflowId) => ({
    queryKey: [workflowId],
    queryFn: () => api.workflows.byId({ workflowId }),
  }),
});
