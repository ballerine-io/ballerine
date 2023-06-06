import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect } from 'react';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useNavigate, useParams } from 'react-router-dom';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const { locale } = useParams();
  const [{ entity, filterId, filterName }, setSearchParams] = useSearchParamsByEntity();
  const navigate = useNavigate();
  const [firstFilter] = filters ?? [];

  useEffect(() => {
    if ((entity && filterId && filterName) || !firstFilter) return;

    navigate(
      `/${locale}/case-management/entities?entity=${firstFilter?.entity}&filterId=${firstFilter?.id}&filterName=${firstFilter?.name}`,
    );
  }, [entity, filterId, filterName, firstFilter, setSearchParams]);
};
