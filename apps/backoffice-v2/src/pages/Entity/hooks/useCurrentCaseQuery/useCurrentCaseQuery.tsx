import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useParams } from 'react-router-dom';

export const useCurrentCaseQuery = () => {
  const { entityId } = useParams();

  return useWorkflowByIdQuery({
    workflowId: entityId ?? '',
  });
};
