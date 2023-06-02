import { useNavigate } from 'react-router-dom';
import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect } from 'react';
import { z } from 'zod';
import { useZodSearchParams } from '../../../../common/hooks/useZodSearchParams/useZodSearchParams';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const navigate = useNavigate();
  const [{ entity, filterId, filterName }, setSearchParams] = useZodSearchParams(
    z.object({
      entity: z.string().catch(''),
      filterId: z.string().catch(''),
      filterName: z.string().catch(''),
    }),
  );

  useEffect(() => {
    if ((entity && filterId && filterName) || !filters?.length) return;

    const [filter] = filters;

    setSearchParams({
      entity: filter?.entity,
      filterId: filter?.id,
      filterName: filter?.name,
    });
  }, [entity, filterId, filterName, filters, navigate]);
};
