import { fetchCustomer } from '@app/domains/customer/customer.api';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const customerQueryKeys = createQueryKeys('customer', {
  getCustomer: () => ({
    queryFn: () => fetchCustomer(),
    queryKey: [{}],
  }),
});
