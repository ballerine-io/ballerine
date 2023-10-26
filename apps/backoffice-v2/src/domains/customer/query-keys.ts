import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchCustomer } from './fetchers';

export const customerQueryKeys = createQueryKeys('customer', {
  getCurrent: () => ({
    queryKey: [{}],
    queryFn: () => fetchCustomer(),
  }),
});
