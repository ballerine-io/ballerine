import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useFiltersQuery } from '@/domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useMemo } from 'react';

export const useCurrentFilter = () => {
  const filterId = useFilterId();
  const { data: filters } = useFiltersQuery();

  const currentFilter = useMemo(() => {
    if (!Array.isArray(filters) || !filterId) return null;

    return filters.find(filter => filter.id === filterId) ?? null;
  }, [filterId, filters]);

  return currentFilter;
};
