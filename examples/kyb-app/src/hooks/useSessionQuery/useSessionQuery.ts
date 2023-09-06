import { collectionFlowQuerykeys } from '@app/domains/collection-flow';
import { useQuery } from '@tanstack/react-query';

export const useSessionQuery = () => {
  const { data: user = null, isFetching } = useQuery({
    ...collectionFlowQuerykeys.getSession(),
    staleTime: Infinity,
  });

  console.log('user', user);
  return {
    user,
    isLoading: isFetching,
  };
};
