import { useEffect, useMemo } from 'react';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useWorkflowsQuery } from '../../../workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useEntityType } from '@/common/hooks/useEntityType/useEntityType';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { HttpError } from '@/common/errors/http-error';

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
  const workflowIds = useMemo(
    () => new Set(workflows?.map(workflow => workflow.id) ?? []),
    [workflows],
  );
  const { error: workflowByIdError } = useWorkflowByIdQuery({ workflowId: caseId ?? '' });
  const { state } = useLocation();
  const prevCaseId = useMemo(() => {
    const match = matchPath(
      '/:locale/case-management/entities/:entityId',
      state?.from?.pathname ?? '',
    );

    return match?.params?.entityId;
  }, [state?.from?.pathname]);

  useEffect(() => {
    if (caseId || !firstCaseId) {
      return;
    }

    const nextEntityId = prevCaseId && workflowIds.has(prevCaseId) ? prevCaseId : firstCaseId;

    if (!nextEntityId) {
      return;
    }

    onSelectEntity(nextEntityId)();
  }, [entity, firstCaseId, caseId, onSelectEntity, prevCaseId, workflowIds]);

  useEffect(() => {
    const isWorkflowNotFound =
      workflowByIdError instanceof HttpError && workflowByIdError.code === 404;

    if (!caseId || !isWorkflowNotFound || !firstCaseId || caseId === firstCaseId) {
      return;
    }

    onSelectEntity(firstCaseId)();
  }, [entity, caseId, firstCaseId, onSelectEntity, workflowByIdError]);
};
