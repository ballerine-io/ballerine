import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useEndUserQuery } from '../useEndUserQuery';

export const useFlowContextQuery = () => {
  const { accessToken } = useAccessToken();
  const { data: endUser } = useEndUserQuery();

  const { data, isLoading, isFetched, error, refetch } = useQuery({
    ...collectionFlowQuerykeys.getContext(endUser?.id ?? null),
    // @ts-ignore
    staleTime: Infinity as const,
    enabled: !!accessToken,
  });

  return {
    data,
    isLoading,
    isLoaded: isFetched,
    error: error ? (error as HTTPError) : null,
    refetch,
  };
};
