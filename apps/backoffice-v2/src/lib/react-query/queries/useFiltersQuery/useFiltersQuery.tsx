import { useQuery } from '@tanstack/react-query';
import { filters } from '../../filters';

export const useFiltersQuery = () => {
  return useQuery(filters.list());
};
