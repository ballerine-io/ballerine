import { useEffect, useMemo } from 'react';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useWorkflowsQuery } from '../../../workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useEntityType } from '@/common/hooks/useEntityType/useEntityType';

/**
 * @description Sets the selected end user to the first end user in the array on mount if no user is currently selected. Returns the select end user handler.
 */
export const useSelectEntityOnMount = () => {
  const { entityId: caseId } = useParams();
  const [{ filterId, filter, sortBy, sortDir, page, pageSize, search }] = useSearchParamsByEntity();
  const { data } = useWorkflowsQuery({ filterId, filter, sortBy, sortDir, page, pageSize, search });
  const { data: workflows } = data || { data: [] };
  const onSelectEntity = useSelectEntity();
  const entity = useEntityType();
  const firstCaseId = workflows?.[0]?.id;
  const { state } = useLocation();
  const prevCaseId = useMemo(() => {
    const match = matchPath(
      '/:locale/case-management/entities/:entityId',
      state?.from?.pathname ?? '',
    );

    return match?.params?.entityId;
  }, [state?.from?.pathname]);

  useEffect(() => {
    if (caseId || (!firstCaseId && !prevCaseId)) return;

    onSelectEntity(prevCaseId || firstCaseId)();
  }, [entity, firstCaseId, caseId, onSelectEntity, prevCaseId]);
};
