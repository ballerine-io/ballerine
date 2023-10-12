import { collectionFlowQuerykeys } from '@app/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useCustomerQuery = () => {
  const { data, isLoading, error } = useQuery(collectionFlowQuerykeys.getCustomer());

  return {
    customer: data ? data : null,
    isLoading,
    error: error ? (error as HTTPError) : null,
  };
};
