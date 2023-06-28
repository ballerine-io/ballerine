import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useWorkflowsQuery } from '../../../workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useEntityType } from '../../../../common/hooks/useEntityType/useEntityType';

/**
 * @description Sets the selected end user to the first end user in the array on mount if no user is currently selected. Returns the select end user handler.
 */
export const useSelectEntityOnMount = (websocketConnectionIsOpen: boolean) => {
  const { entityId } = useParams();
  const [{ filterId, filter, sortBy, sortDir, page, pageSize }] = useSearchParamsByEntity();
  const { data } = useWorkflowsQuery({
    filterId,
    filter,
    sortBy,
    sortDir,
    page,
    pageSize,
    websocketConnectionIsOpen,
  });
  const { data: workflows } = data || { data: [] };
  const onSelectEntity = useSelectEntity();
  const entity = useEntityType();
  const firstCaseId = workflows?.[0]?.id;

  useEffect(() => {
    if (entityId) return;

    if (!firstCaseId) return;

    onSelectEntity(firstCaseId)();
  }, [entity, firstCaseId, entityId, onSelectEntity]);
};
