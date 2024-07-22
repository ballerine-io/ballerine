import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { useWorkflowDefinitionUpdateMutation } from '@/pages/WorkflowDefinition/hooks/useWorkflowDefinitionUpdateMutation';
import { useCallback, useEffect, useState } from 'react';

export const useWorkflowDefinitionEdit = (workflowDefinition: IWorkflowDefinition | undefined) => {
  const [workflowDefinitionValue, setWorkflowDefinitionValue] = useState(
    workflowDefinition?.definition,
  );
  const { mutate, isLoading } = useWorkflowDefinitionUpdateMutation();

  useEffect(() => {
    setWorkflowDefinitionValue(workflowDefinition?.definition);
  }, [workflowDefinition]);

  const handleWorkflowDefinitionSave = useCallback(
    (value: object) => {
      if (!workflowDefinition) return;

      setWorkflowDefinitionValue(value);

      mutate({
        workflowDefinitionId: workflowDefinition.id!,
        definition: value,
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
