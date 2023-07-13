import { IUseActionsLogic } from './interfaces';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useSelectNextEntity } from '../../../../../../domains/entities/hooks/useSelectNextEntity/useSelectNextEntity';
import { createInitials } from '../../../../../../common/utils/create-initials/create-initials';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';

export const useCurrentEntity = ({
  workflowId,
  fullName,
}: Pick<IUseActionsLogic, 'workflowId' | 'fullName'>) => {
  const filterId = useFilterId();
  const onSelectNextEntity = useSelectNextEntity();
  // Create initials from the first character of the first name, middle name, and last name.
  const initials = createInitials(fullName);
  const { data: workflow, isLoading: isLoadingEntity } = useWorkflowQuery({ workflowId, filterId });

  return {
    initials,
    isLoadingEntity,
    workflow,
    onSelectNextEntity,
  };
};
