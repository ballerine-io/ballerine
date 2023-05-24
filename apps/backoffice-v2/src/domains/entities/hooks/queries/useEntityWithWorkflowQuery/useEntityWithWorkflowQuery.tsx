import { useEntityQuery } from '../useEntityQuery/useEntityQuery';
import { useWorkflowQuery } from '../../../../workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useWorkflowsQuery } from '../../../../workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';

export const useEntityWithWorkflowQuery = (entityId: string) => {
  const entity = useFilterEntity();
  const workflowId = useWorkflowsQuery()?.data?.find(
    workflow =>
      (entity === 'individuals' && workflow.endUserId === entityId) ||
      (entity === 'businesses' && workflow.businessId === entityId),
  )?.id;
  const { data: workflow } = useWorkflowQuery({ workflowId });

  return useEntityQuery({
    entityId,
    select: entity => ({
      ...entity,
      workflow,
    }),
  });
};
