import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const workflows = createQueryKeys('workflows', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => api.workflows.list(),
  }),
  byId: ({ workflowId }: { workflowId: string }) => ({
    queryKey: [workflowId],
    queryFn: () => api.workflows.byId({ workflowId }),
  }),
});
