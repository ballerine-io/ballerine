import { useNavigate, useSearch } from '@tanstack/react-router';
import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect } from 'react';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const navigate = useNavigate();
  const { entity, filterId, filterName } = useSearch({
    strict: false,
    track({ entity, filterId, filterName }) {
      return {
        entity,
        filterId,
        filterName,
      };
    },
  });

  useEffect(() => {
    if ((entity && filterId && filterName) || !filters?.length) return;

    const [filter] = filters;

    void navigate({
      to: '/$locale/case-management/entities',
      search: {
        entity: filter?.entity,
        filterId: filter?.id,
        filterName: filter?.name,
      },
    });
  }, [entity, filterId, filterName, filters, navigate]);
};
