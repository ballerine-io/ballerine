import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useEndUserQuery } from '../useEndUserQuery';

export const useCustomerQuery = () => {
  const { accessToken } = useAccessToken();
  const { data: endUser } = useEndUserQuery();

  const { data, isLoading, error, isFetched, refetch } = useQuery({
    ...collectionFlowQuerykeys.getCustomer(endUser?.id ?? null),
    //@ts-ignore
    enabled: !!accessToken,
  });

  return {
    customer: data ? data : null,
    isLoading: isLoading && !isFetched,
    isLoaded: isFetched,
    error: error ? (error as HTTPError) : null,
    refetch,
  };
};
