import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useCustomerQuery = () => {
  const { data, isLoading, error } = useQuery(
    // @ts-ignore
    collectionFlowQuerykeys.getCustomer(),
  );

  return {
    customer: data ? data : null,
    isLoading,
    error: error ? (error as HTTPError) : null,
  };
};
