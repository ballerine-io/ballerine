import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const workflows = createQueryKeys('workflows', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => api.workflows.list(),
  }),
  byId: ({ endUserId }: { endUserId: string }) => ({
    queryKey: [endUserId],
    queryFn: () => api.workflows.byId({ endUserId }),
  }),
});
