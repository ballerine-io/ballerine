import { filtersQueryKeys, GetFiltersListDto } from '@/domains/filters';
import { useQuery } from '@tanstack/react-query';

export const useFiltersQuery = (query: GetFiltersListDto) => {
  const { isLoading, data } = useQuery({
    ...filtersQueryKeys.list(query),
    // @ts-ignore
    retry: false,
    keepPreviousData: true,
  });

  return {
    isLoading,
    data,
  };
};
