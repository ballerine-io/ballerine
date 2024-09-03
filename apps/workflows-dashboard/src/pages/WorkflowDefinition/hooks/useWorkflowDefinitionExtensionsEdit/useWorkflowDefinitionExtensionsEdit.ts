import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { useWorkflowDefinitionExtensionsUpdateMutation } from '@/pages/WorkflowDefinition/hooks/useWorkflowDefinitionExtensionsUpdateMutation';
import { useCallback, useEffect, useState } from 'react';

export const useWorkflowDefinitionExtensionsEdit = (
  workflowDefinition: IWorkflowDefinition | undefined,
) => {
  const [workflowDefinitionExtensions, setWorkflowDefinitionValue] = useState(
    workflowDefinition?.extensions,
  );
  const { mutate, isLoading } = useWorkflowDefinitionExtensionsUpdateMutation();

  useEffect(() => {
    setWorkflowDefinitionValue(workflowDefinition?.extensions);
  }, [workflowDefinition]);

  const handleWorkflowExtensionsSave = useCallback(
    (value: object) => {
      if (!workflowDefinition) return;

      setWorkflowDefinitionValue(value);

      mutate({
        workflowDefinitionId: workflowDefinition.id!,
        extensions: value,
      });
    },
    [workflowDefinition],
  );

  return {
    workflowDefinitionExtensions,
    isUpdating: isLoading,
    handleWorkflowExtensionsSave,
  };
};
