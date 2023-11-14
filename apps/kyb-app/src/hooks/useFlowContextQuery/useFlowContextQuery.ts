import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';

export const useFlowContextQuery = () => {
  const { data, isLoading } = useQuery({
    ...collectionFlowQuerykeys.getContext(),
    staleTime: Infinity,
  });

  return {
    data,
    isLoading,
  };
};
