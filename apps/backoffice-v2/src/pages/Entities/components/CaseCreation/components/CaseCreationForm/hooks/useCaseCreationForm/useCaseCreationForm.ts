import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';
import { useCreateWorkflowMutation } from '@/domains/workflows/hooks/mutations/useCreateWorkflowMutation/useCreateWorkflowMutation';
import { createContextFromFormData } from '@/pages/Entities/components/CaseCreation/components/CaseCreationForm/hooks/useCaseCreationForm/utils/create-context-from-form-data';
import { useCaseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/hooks/useCaseCreationContext';
import { AnyObject } from '@ballerine/ui';
import { useCallback } from 'react';

export const useCaseCreationForm = (workflowDefinition: TWorkflowDefinitionById) => {
  const { isLoading, mutateAsync } = useCreateWorkflowMutation();
  const { isMultipleCasesCreation, setIsOpen } = useCaseCreationContext();

  const handleSubmit = useCallback(
    async (formData: AnyObject) => {
      const context = createContextFromFormData(formData);

      await mutateAsync({ workflowDefinitionId: workflowDefinition.id, context });

      if (!isMultipleCasesCreation) {
        setIsOpen(false);
      }
    },
    [workflowDefinition, isMultipleCasesCreation, mutateAsync, setIsOpen],
  );

  return {
    isLoading,
    handleSubmit,
  };
};
