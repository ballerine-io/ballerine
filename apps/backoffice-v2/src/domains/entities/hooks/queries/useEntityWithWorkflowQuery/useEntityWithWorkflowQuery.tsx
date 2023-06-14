import { useEntityQuery } from '../useEntityQuery/useEntityQuery';
import { useWorkflowQuery } from '../../../../workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useWorkflowsQuery } from '../../../../workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { useFilterEntity } from '../../useFilterEntity/useFilterEntity';

export const useEntityWithWorkflowQuery = (entityId: string) => {
  const entity = useFilterEntity();
  const workflowId = useWorkflowsQuery()
    ?.data?.slice()
    ?.sort((a, b) => {
      if (
        a?.workflowDefinitionId?.startsWith('MANUAL_REVIEW_') &&
        !b?.workflowDefinitionId?.startsWith('MANUAL_REVIEW_')
      )
        return -1;
      if (
        b?.workflowDefinitionId?.startsWith('MANUAL_REVIEW_') &&
        !a?.workflowDefinitionId?.startsWith('MANUAL_REVIEW_')
      )
        return 1;

      return 0;
    })
    ?.find(
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
