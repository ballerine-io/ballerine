import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const useUISchemasQuery = () => {
  const lng = 'en';

  const { data, isLoading, error } = useQuery({
    ...collectionFlowQuerykeys.getUISchema(lng),
    // @ts-ignore
    staleTime: Infinity,
  });

  return {
    isLoading,
    data: data ?? null,
    error: error ? (error as HTTPError) : null,
  };
};
