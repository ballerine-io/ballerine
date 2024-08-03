import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { useWorkflowDefinitionUpdateMutation } from '@/pages/WorkflowDefinition/hooks/useWorkflowDefinitionUpdateMutation';
import { useCallback, useEffect, useState } from 'react';

export const useWorkflowDefinitionEdit = (workflowDefinition: IWorkflowDefinition | undefined) => {
  const [workflowDefinitionValue, setWorkflowDefinitionValue] = useState(
    workflowDefinition?.definition,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate, isLoading } = useWorkflowDefinitionUpdateMutation();

  useEffect(() => {
    setWorkflowDefinitionValue(workflowDefinition?.definition);
  }, [workflowDefinition]);

  const handleWorkflowDefinitionSave = useCallback(
    (definition: object) => {
      if (!workflowDefinition) return;

      setWorkflowDefinitionValue(definition);

      mutate({
        workflowDefinitionId: workflowDefinition.id!,
        definition: definition,
      });
    },
    [workflowDefinition],
  );

  return {
    workflowDefinitionValue,
    isUpdating: isLoading,
    handleWorkflowDefinitionSave,
  };
};
