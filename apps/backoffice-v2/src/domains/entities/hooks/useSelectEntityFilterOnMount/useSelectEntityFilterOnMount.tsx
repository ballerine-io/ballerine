import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect } from 'react';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useNavigate, useParams } from 'react-router-dom';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const { locale } = useParams();
  const [{ entity, filterId }, setSearchParams] = useSearchParamsByEntity();
  const navigate = useNavigate();
  const [firstFilter] = filters ?? [];

  useEffect(() => {
    if ((entity && filterId) || !firstFilter) return;

    navigate(
      `/${locale}/case-management/entities?entity=${firstFilter?.entity}&filterId=${firstFilter?.id}`,
    );
  }, [entity, filterId, firstFilter, setSearchParams]);
};
