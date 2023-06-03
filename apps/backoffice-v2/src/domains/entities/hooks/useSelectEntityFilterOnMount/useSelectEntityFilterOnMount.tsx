import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect } from 'react';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const [{ entity, filterId, filterName }, setSearchParams] = useSearchParamsByEntity();
  const [firstFilter] = filters ?? [];

  useEffect(() => {
    if ((entity && filterId && filterName) || !firstFilter) return;

    setSearchParams({
      entity: firstFilter.entity,
      filterId: firstFilter.id,
      filterName: firstFilter.name,
    });
  }, [entity, filterId, filterName, firstFilter, setSearchParams]);
};
