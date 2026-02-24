import { useFiltersQuery } from '../../../filters/hooks/queries/useFiltersQuery/useFiltersQuery';
import { useEffect, useMemo } from 'react';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEntityType } from '../../../../common/hooks/useEntityType/useEntityType';
import { searchParamsToObject } from '../../../../common/hooks/useZodSearchParams/utils/search-params-to-object';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { getCaseManagementEntitiesHrefByFilterId } from '@/common/utils/get-case-management-entities-href-by-filter-id/get-case-management-entities-href-by-filter-id';
import { StateTag } from '@ballerine/common';

const SL_FILTER_PREFIXES = [
  'filter-sl-kyc-individuals-',
  'filter-sl-kyb-businesses-',
  'filter-sl-loan-applications-',
];

const SL_DEFAULT_CASE_STATUS = [StateTag.MANUAL_REVIEW] as const;

export const useSelectEntityFilterOnMount = () => {
  const { data: filters } = useFiltersQuery();
  const locale = useLocale();
  const [{ filterId, filter }, setSearchParams] = useSearchParamsByEntity();
  const entity = useEntityType();
  const navigate = useNavigate();
  const [firstFilter] = filters ?? [];
  const { state } = useLocation();
  const prevFilterId = useMemo(
    () => searchParamsToObject(new URLSearchParams(state?.from?.search))?.filterId,
    [state?.from?.search],
  );

  useEffect(() => {
    if ((entity && filterId) || (!firstFilter && !prevFilterId)) {
      return;
    }

    const targetFilterId = prevFilterId || firstFilter?.id;

    if (!targetFilterId) {
      return;
    }

    const href = state?.from?.search
      ? `/${locale}/case-management/entities${state.from.search}`
      : getCaseManagementEntitiesHrefByFilterId({
          locale,
          filterId: targetFilterId,
        });

    navigate(href, {
      state: {
        from: state?.from,
      },
    });
  }, [
    entity,
    filterId,
    firstFilter,
    locale,
    navigate,
    prevFilterId,
    state?.from,
    state?.from?.search,
  ]);

  useEffect(() => {
    if (!filterId || filter?.caseStatus?.length) {
      return;
    }

    const shouldApplySlStatuses = SL_FILTER_PREFIXES.some(prefix => filterId.startsWith(prefix));

    if (!shouldApplySlStatuses) {
      return;
    }

    setSearchParams({
      filter: {
        ...filter,
        caseStatus: [...SL_DEFAULT_CASE_STATUS],
      },
    });
  }, [filter, filterId, setSearchParams]);
};
