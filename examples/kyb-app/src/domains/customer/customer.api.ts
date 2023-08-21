import { request } from '@app/common/utils/request';
import { TCustomer } from '@app/domains/customer/types';

export const fetchCustomer = async (): Promise<TCustomer> => {
  const result = await request.get('external/customers/me').json<TCustomer>();

  return result;
};
