import { filtersContext } from '@/components/providers/FiltersProvider/filters-provider.context';
import { FiltersContext } from '@/components/providers/FiltersProvider/filters-provider.types';

import { useCallback, useMemo } from 'react';
import { QueryParamConfig, useQueryParams } from 'use-query-params';

const { Provider } = filtersContext;

export interface IFilterProviderProps<TFilterValues = object> {
  children: React.ReactNode | React.ReactNode[];
  querySchema: Record<string, QueryParamConfig<any>>;
  deserializer?: (queryValues: any) => TFilterValues;
}

export const FiltersProvider = ({ children, querySchema, deserializer }: IFilterProviderProps) => {
  const [query, setQuery] = useQueryParams(querySchema);
  const filterValues = useMemo(() => (deserializer ? deserializer(query) : query), [query]);

  const updateFilters = useCallback(
    (filters: Partial<any>) => {
      setQuery(filters);
    },
    [setQuery],
  );

  const context = useMemo(() => {
    const ctx: FiltersContext = {
      filters: filterValues,
      updateFilters,
    };

    return ctx;
  }, [filterValues, updateFilters]);

  return <Provider value={context}>{children}</Provider>;
};
