import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const businesses = createQueryKeys('businesses', {
  list: (filterId: string) => ({
    queryKey: [{ filterId }],
    queryFn: () => api.businesses.list(filterId),
  }),
  byId: (businessId: string) => ({
    queryKey: [businessId],
    queryFn: () => api.businesses.byId(businessId),
  }),
});
