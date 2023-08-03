import { getFiltersFromQuery } from '../get-filters-from-query/get-filters-from-query';
import { TEntityType } from 'src/domains/entities/types';

export function getEntityTypeByFilterId(filterId: string): null | TEntityType {
  return getFiltersFromQuery().find(filter => filter.id === filterId)?.entity || null;
}
