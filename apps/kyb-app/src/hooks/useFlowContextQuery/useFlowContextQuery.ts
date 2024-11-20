import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useFlowContextQuery = () => {
  const { accessToken } = useAccessToken();

  const { data, isLoading, isFetched, error, refetch } = useQuery({
    ...collectionFlowQuerykeys.getContext(),
    // @ts-ignore
    staleTime: Infinity as const,
    enabled: !!accessToken,
  });

  return {
    data,
    isLoading: isLoading && !isFetched,
    isLoaded: isFetched,
    error: error ? (error as HTTPError) : null,
    refetch,
  };
};
