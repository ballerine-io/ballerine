import { useFilters } from '@/components/providers/FiltersProvider/hooks/useFilters';
import { useFiltersQuery } from '@/pages/Filters/hooks/useFiltersQuery';
import { FiltersPageFilterValues } from '@/pages/Filters/types/filters-filter-values';
import { useCallback } from 'react';

export const useFiltersPagePagination = () => {
  const { filters, updateFilters } = useFilters<FiltersPageFilterValues>();
  const { data } = useFiltersQuery(filters);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateFilters({ page: nextPage });
    },
    [updateFilters],
  );

  return {
    handlePageChange,
    total: data?.meta.pages || 1,
    page: filters.page || 1,
  };
};
