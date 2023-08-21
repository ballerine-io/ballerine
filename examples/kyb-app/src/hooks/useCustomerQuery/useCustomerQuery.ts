import { customerQueryKeys } from '@app/domains/customer';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useCustomerQuery = () => {
  const { data, isLoading, error } = useQuery(customerQueryKeys.getCustomer());

  return {
    customer: data ? data : null,
    isLoading,
    error: error ? (error as HTTPError) : null,
  };
};
