import { alertDefinitionsQueryKeys } from '@/domains/alert-definitions';
import { useQuery } from '@tanstack/react-query';

export const useAlertDefinitionsQuery = () => {
  const { isLoading, data } = useQuery({
    ...alertDefinitionsQueryKeys.list(),
    // @ts-ignore
    retry: false,
    keepPreviousData: true,
  });

  return {
    isLoading,
    data,
  };
};
