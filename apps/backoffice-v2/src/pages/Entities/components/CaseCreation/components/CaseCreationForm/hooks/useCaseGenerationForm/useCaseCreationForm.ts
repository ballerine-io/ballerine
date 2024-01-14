import { TWorkflowDefinition } from '@/domains/workflows/fetchers';
import { useCreateWorkflowMutation } from '@/domains/workflows/hooks/mutations/useCreateWorkflowMutation/useCreateWorkflowMutation';
import { prepareContext } from '@/pages/Entities/components/CaseCreation/components/CaseCreationForm/hooks/useCaseGenerationForm/utils/prepare-context';
import { useCaseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/hooks/useCaseCreationContext';
import { AnyObject } from '@ballerine/ui';
import { useCallback } from 'react';

export const useCaseCreationForm = (workflowDefinition: TWorkflowDefinition) => {
  const { isLoading, mutateAsync } = useCreateWorkflowMutation();
  const { isMultipleCasesCreation, setIsOpen: setOpen } = useCaseCreationContext();

  const handleSubmit = useCallback(
    async (formData: AnyObject) => {
      const context = prepareContext(formData);

      await mutateAsync({ workflowDefinitionId: workflowDefinition.id, context });

      if (!isMultipleCasesCreation) {
        setOpen(false);
      }
    },
    [workflowDefinition, isMultipleCasesCreation, mutateAsync, setOpen],
  );

  return {
    isLoading,
    handleSubmit,
  };
};
