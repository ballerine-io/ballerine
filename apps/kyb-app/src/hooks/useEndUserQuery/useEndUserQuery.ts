import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useEndUserQuery = () => {
  const { data, isLoading, error, refetch, isFetched } = useQuery({
    ...collectionFlowQuerykeys.getEndUser(),
    // @ts-ignore
    staleTime: Infinity as const,
  });

  return {
    data,
    isLoading: isLoading && !isFetched,
    error: error ? (error as HTTPError) : null,
    refetch,
    isLoaded: isFetched,
  };
};
