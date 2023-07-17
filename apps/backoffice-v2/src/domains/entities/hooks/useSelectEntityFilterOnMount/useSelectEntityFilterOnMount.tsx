import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect, useMemo } from 'react';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEntityType } from '../../../../common/hooks/useEntityType/useEntityType';
import { searchParamsToObject } from '../../../../common/hooks/useZodSearchParams/utils/search-params-to-object';

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const { locale } = useParams();
  const [{ filterId }, setSearchParams] = useSearchParamsByEntity();
  const entity = useEntityType();
  const navigate = useNavigate();
  const [firstFilter] = filters ?? [];
  const { state } = useLocation();
  const prevFilterId = useMemo(
    () => searchParamsToObject(new URLSearchParams(state?.from?.search))?.filterId,
    [state?.from?.search],
  );

  useEffect(() => {
    if ((entity && filterId) || (!firstFilter && !prevFilterId)) return;

    navigate(`/${locale}/case-management/entities?filterId=${prevFilterId || firstFilter?.id}`, {
      state: {
        from: state?.from,
      },
    });
  }, [entity, filterId, firstFilter, locale, navigate, prevFilterId, state?.from]);
};
