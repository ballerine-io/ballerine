import { getFiltersFromQuery } from '../get-filters-from-query/get-filters-from-query';
import { TEntityType } from '@/common/hooks/useEntityType/useEntityType';

export const getEntityTypeByFilterId = (filterId: string): null | TEntityType => {
  return getFiltersFromQuery().find(filter => filter.id === filterId)?.entity || null;
};
