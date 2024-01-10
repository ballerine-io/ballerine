import { TWorkflowDefinition } from '@/domains/workflows/fetchers';
import { useCreateWorkflowMutation } from '@/domains/workflows/hooks/mutations/useCreateWorkflowMutation/useCreateWorkflowMutation';
import { prepareContext } from '@/pages/Entities/components/CaseGeneration/components/CaseGenerationForm/hooks/useCaseGenerationForm/utils/prepare-context';
import { AnyObject } from '@ballerine/ui';
import { useCallback } from 'react';

export const useCaseGenerationForm = (workflowDefinition: TWorkflowDefinition) => {
  const { isLoading, mutate } = useCreateWorkflowMutation();

  const handleSubmit = useCallback(
    (formData: AnyObject) => {
      const context = prepareContext(formData);

      mutate({ workflowDefinitionId: workflowDefinition.id, context });
    },
    [workflowDefinition, mutate],
  );

  return {
    isLoading,
    handleSubmit,
  };
};
