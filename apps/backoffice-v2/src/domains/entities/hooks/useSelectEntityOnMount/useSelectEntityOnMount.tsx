import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelectEntity } from '../useSelectEntity/useSelectEntity';
import { useFilterEntity } from '../useFilterEntity/useFilterEntity';
import { useWorkflowsQuery } from '../../../workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';

/**
 * @description Sets the selected end user to the first end user in the array on mount if no user is currently selected. Returns the select end user handler.
 */
export const useSelectEntityOnMount = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflows } = useWorkflowsQuery(filterId);
  const onSelectEntity = useSelectEntity();
  const entity = useFilterEntity();
  const firstCaseId = workflows?.[0]?.id;

  useEffect(() => {
    if (entityId) return;

    if (!firstCaseId) return;

    onSelectEntity(firstCaseId)();
  }, [entity, firstCaseId, entityId, onSelectEntity]);
};
