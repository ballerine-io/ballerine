import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';

export const useSessionQuery = () => {
  const { data: user = null, isFetching } = useQuery({
    ...collectionFlowQuerykeys.getSession(),
    // @ts-ignore
    staleTime: Infinity,
  });

  return {
    user,
    isLoading: isFetching,
  };
};
