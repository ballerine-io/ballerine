import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useCustomerQuery = () => {
  const { accessToken } = useAccessToken();

  const { data, isLoading, error, isFetched, refetch } = useQuery({
    ...collectionFlowQuerykeys.getCustomer(),
    //@ts-ignore
    enabled: !!accessToken,
  });

  return {
    customer: data ? data : null,
    data,
    isLoading: isLoading && !isFetched,
    isLoaded: isFetched,
    error: error ? (error as HTTPError) : null,
    refetch,
  };
};
