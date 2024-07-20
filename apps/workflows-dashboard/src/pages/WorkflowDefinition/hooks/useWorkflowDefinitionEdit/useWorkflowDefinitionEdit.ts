import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { queryClient } from '@/lib/react-query/query-client';
import { useCallback, useEffect, useState } from 'react';

export const useWorkflowDefinitionEdit = (workflowDefinition: IWorkflowDefinition | undefined) => {
  const [workflowDefinitionValue, setWorkflowDefinitionValue] = useState(
    workflowDefinition?.definition,
  );

  useEffect(() => {
    setWorkflowDefinitionValue(workflowDefinition?.definition);
  }, [workflowDefinition]);

  const handleSave = useCallback(
    (value: object) => {
      setWorkflowDefinitionValue(value);

      const queryKeys = [
        'workflowDefinitions',
        'get',
        { query: { workflowDefinitionId: workflowDefinition?.id } },
      ];

      queryClient.setQueryData(queryKeys, {
        ...workflowDefinition,
        definition: {
          ...value,
        },
      });
    },
    [workflowDefinition],
  );

  return {
    workflowDefinitionValue,
    handleSave,
  };
};
