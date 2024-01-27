import { useMemo } from 'react';
import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';

export const useFormSchema = (workflowDefinition: TWorkflowDefinitionById) => {
  const inputSchema = useMemo(
    () =>
      workflowDefinition?.definition?.states[workflowDefinition?.definition?.initial]?.meta
        ?.inputSchema,
    [workflowDefinition],
  );

  const jsonSchema = useMemo(() => inputSchema?.dataSchema || { type: 'object' }, [inputSchema]);

  const uiSchema = useMemo(() => inputSchema?.uiSchema || {}, [inputSchema]);

  return {
    jsonSchema,
    uiSchema,
  };
};
