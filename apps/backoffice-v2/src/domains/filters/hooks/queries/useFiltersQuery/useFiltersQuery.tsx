import { useQuery } from '@tanstack/react-query';
import { filtersQueryKeys } from '../../../query-keys';

export const useFiltersQuery = () => {
  return useQuery(filtersQueryKeys.list());
};
