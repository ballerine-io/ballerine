import { collectionFlowQuerykeys } from '@app/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useUISchemasQuery = () => {
  const { data, isLoading, error } = useQuery({
    ...collectionFlowQuerykeys.getUISchema(),
    staleTime: Infinity,
  });

  return {
    isLoading,
    data: data ?? null,
    error: error as HTTPError,
  };
};
