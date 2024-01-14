import { useCurrentFilter } from '@/common/hooks/useCurrentFilter/useCurrentFilter';
import { TFilter } from '@/domains/filters/types';
import { useWorkflowDefinitionByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowDefinitionQuery/useWorkflowDefinitionQuery';
import { selectWorkflowDefinitionId } from '@/pages/Entities/components/CaseGeneration/hooks/useCaseGenerationWorkflowDefinition/selectors/select-workflow-definition-id';
import { useMemo } from 'react';

export const useCaseGenerationWorkflowDefinition = () => {
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
