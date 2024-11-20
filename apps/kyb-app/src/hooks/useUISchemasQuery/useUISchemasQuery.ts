import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useEndUserQuery } from '../useEndUserQuery';

export const useUISchemasQuery = ({ language }: { language: string }) => {
  const { isLoading: isEndUserLoading, data: endUser } = useEndUserQuery();

  const { data, isLoading, error, isFetched, refetch } = useQuery({
    ...collectionFlowQuerykeys.getUISchema({ language, endUserId: endUser?.id }),
    // @ts-ignore
    staleTime: Infinity as const,
    enabled: !isEndUserLoading,
  });

  return {
    isLoading: isLoading && !isFetched,
    isLoaded: isFetched,
    data: data ?? null,
    error: error ? (error as HTTPError) : null,
    refetch,
  };
};
