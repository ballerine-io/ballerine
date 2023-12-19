import { useParams } from 'react-router-dom';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '@/domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';

export const useEntityLogic = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({ workflowId: entityId, filterId });
  const selectedEntity = workflow?.entity;

  return {
    selectedEntity,
    workflow,
  };
};
