import { useMemo } from 'react';
import { useFilterId } from '../useFilterId/useFilterId';
import { TEntityType } from '../../../domains/entities/types';
import { useFiltersQuery } from '../../../domains/filters/hooks/queries/useFiltersQuery/useFiltersQuery';

export function useEntityType(defaultEntityType: TEntityType = 'individuals'): TEntityType {
  const filterId = useFilterId();
  const { data: filters, isLoading } = useFiltersQuery();

  const entityType = useMemo(() => {
    if (isLoading || !Array.isArray(filters)) return null;

    const matchedFilter = filters.find(filter => filter.id === filterId);

    return matchedFilter ? (matchedFilter.entity as TEntityType) : null;
  }, [filterId, filters, isLoading]);

  return entityType ? entityType : defaultEntityType;
}
