import { useCurrentFilter } from '@/common/hooks/useCurrentFilter/useCurrentFilter';
import { TFilter } from '@/domains/filters/fetchers';
import { useWorkflowDefinitionByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowDefinitionQuery/useWorkflowDefinitionQuery';
import { selectWorkflowDefinitionId } from '@/pages/Entities/components/CaseCreation/hooks/useCaseCreationWorkflowDefinition/selectors/select-workflow-definition-id';
import { useMemo } from 'react';

export const useCaseCreationWorkflowDefinition = () => {
  const currentFilter = useCurrentFilter();
  const workflowDefinitionId = useMemo(
    () => selectWorkflowDefinitionId(currentFilter as TFilter),
    [currentFilter],
  );
  const {
    data: workflowDefinition,
    isLoading,
    error,
  } = useWorkflowDefinitionByIdQuery({
    workflowDefinitionId,
  });

  return {
    workflowDefinition: workflowDefinition ?? null,
    isLoading,
    error,
  };
};
