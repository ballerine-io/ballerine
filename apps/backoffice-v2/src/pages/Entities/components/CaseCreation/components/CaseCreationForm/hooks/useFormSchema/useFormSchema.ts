import { TWorkflowDefinition } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';

export const useFormSchema = (workflowDefinition: TWorkflowDefinition) => {
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
