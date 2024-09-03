import { GetUIDefinitionByIdDto, uiDefinitionsQueryKeys } from '@/domains/ui-definitions';
import { useQuery } from '@tanstack/react-query';

export const useUIDefinitionQuery = (query: GetUIDefinitionByIdDto) => {
  const { isLoading, data, error } = useQuery({
    ...uiDefinitionsQueryKeys.get(query),
    // @ts-ignore
    retry: false,
    keepPreviousData: true,
  });

  return {
    isLoading,
    data,
    error,
  };
};
