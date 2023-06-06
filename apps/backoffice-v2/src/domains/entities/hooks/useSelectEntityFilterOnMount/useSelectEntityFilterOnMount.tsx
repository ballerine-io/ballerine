import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect } from 'react';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useNavigate, useParams } from 'react-router-dom';
import { useFilterEntity } from '../../hooks/useFilterEntity/useFilterEntity';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const { locale } = useParams();
  const [{ filterId, filterName }, setSearchParams] = useSearchParamsByEntity();
  const entity = useFilterEntity();
  const navigate = useNavigate();
  const [firstFilter] = filters ?? [];

  useEffect(() => {
    if ((entity && filterId && filterName) || !firstFilter) return;

    navigate(
      `/${locale}/case-management/entities?filterId=${firstFilter?.id}&filterName=${firstFilter?.name}`,
    );
  }, [entity, filterId, filterName, firstFilter, setSearchParams]);
};
