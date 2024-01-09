import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '@/domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useParams } from 'react-router-dom';

export const useCaseGenerationWorkflow = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({
    workflowId: entityId as string,
    filterId: filterId as string,
  });

  return {
    workflow,
  };
};
