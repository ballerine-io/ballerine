import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect } from 'react';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { entity, filterId, filterName } = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    if ((entity && filterId && filterName) || !filters?.length) return;

    const [filter] = filters;

    setSearchParams(prevSearchParams => ({
      ...prevSearchParams,
      entity: filter?.entity,
      filterId: filter?.id,
      filterName: filter?.name,
    }));
  }, [entity, filterId, filterName, filters, navigate]);
};
