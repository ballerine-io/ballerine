import { FiltersPageFilterValues } from '@/pages/Filters/types/filters-filter-values';
import { FiltersPageFilterQuery } from '@/pages/Filters/types/filters-query-params';

export const deserializeQueryParams = (query: FiltersPageFilterQuery) => {
  const filters: FiltersPageFilterValues = {
    page: query.page as number,
    limit: query.limit as number,
  };

  return filters;
};
