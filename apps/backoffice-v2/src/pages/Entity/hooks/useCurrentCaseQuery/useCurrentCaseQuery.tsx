import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useParams } from 'react-router-dom';

export const useCurrentCaseQuery = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();

  return useWorkflowByIdQuery({
    workflowId: entityId ?? '',
    filterId: filterId ?? '',
  });
};
