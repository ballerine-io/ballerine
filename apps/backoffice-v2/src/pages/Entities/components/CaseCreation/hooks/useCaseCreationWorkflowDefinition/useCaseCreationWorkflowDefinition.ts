import { useCurrentFilter } from '@/common/hooks/useCurrentFilter/useCurrentFilter';
import { useWorkflowDefinitionByIdQuery } from '@/domains/workflow-definitions/hooks/queries/useWorkflowDefinitionByQuery/useWorkflowDefinitionByIdQuery';
import { selectWorkflowDefinitionId } from '@/pages/Entities/components/CaseCreation/hooks/useCaseCreationWorkflowDefinition/selectors/select-workflow-definition-id';
import { useMemo } from 'react';

export const useCaseCreationWorkflowDefinition = () => {
  const currentFilter = useCurrentFilter();
  const workflowDefinitionId = useMemo(
    () => selectWorkflowDefinitionId(currentFilter),
    [currentFilter],
  );
  const {
    data: workflowDefinition,
    isLoading,
    error,
  } = useWorkflowDefinitionByIdQuery({
    workflowDefinitionId: workflowDefinitionId ?? '',
  });

  return {
    workflowDefinition: workflowDefinition ?? null,
    isLoading,
    error,
  };
};
