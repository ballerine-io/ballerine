import { uiDefinitionsQueryKeys } from '@/domains/ui-definitions';
import { useQuery } from '@tanstack/react-query';

export const useUIDefinitionsQuery = () => {
  const { isLoading, data } = useQuery({
    ...uiDefinitionsQueryKeys.list(),
    // @ts-ignore
    retry: false,
    keepPreviousData: true,
  });

  return {
    isLoading,
    data,
  };
};
