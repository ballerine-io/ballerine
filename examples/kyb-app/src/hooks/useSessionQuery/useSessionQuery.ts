import { collectionFlowQuerykeys } from '@app/domains/collection-flow';
import { TOKEN_KEY } from '@app/hooks/useSignin';
import { useQuery } from '@tanstack/react-query';

export const useSessionQuery = () => {
  const { data: user = null, isFetching } = useQuery({
    ...collectionFlowQuerykeys.getSession({ email: localStorage.getItem(TOKEN_KEY) }),
    enabled: Boolean(localStorage.getItem(TOKEN_KEY)),
    staleTime: Infinity,
  });

  return {
    user,
    isLoading: isFetching,
  };
};
