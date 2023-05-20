import { useFiltersQuery } from '../../../lib/react-query/queries/useFiltersQuery/useFiltersQuery';
import { useNavigate } from '@tanstack/react-router';
import { useFilterEntity } from '../useFilterEntity/useFilterEntity';
import { useEffect } from 'react';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const navigate = useNavigate();
  const entity = useFilterEntity();

  useEffect(() => {
    if (entity) return;

    const [filter] = filters ?? [];

    void navigate({
      to: '/$locale/case-management/individuals',
      search: {
        entity: filter?.entity,
        filterId: filter?.id,
        filterName: filter?.name,
      },
    });
  }, []);
};
