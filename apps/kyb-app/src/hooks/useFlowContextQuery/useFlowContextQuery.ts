import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useFlowContextQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    ...collectionFlowQuerykeys.getContext(),
    // @ts-ignore
    staleTime: Infinity,
  });

  return {
    data,
    isLoading,
    error: error ? (error as HTTPError) : null,
    refetch,
  };
};
