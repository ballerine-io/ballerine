import { TWorkflowDefinition } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';

export const useFormSchema = (workflowDefinition: TWorkflowDefinition) => {
  const transitionSchema = useMemo(
    () =>
      workflowDefinition?.definition?.transitionSchema?.find(
        schema => schema.state === workflowDefinition?.definition?.initial,
      ) ?? null,
    [workflowDefinition],
  );

  const jsonSchema = useMemo(() => {
    return transitionSchema?.schema || { type: 'object' };
  }, [transitionSchema]);

  const uiSchema = useMemo(
    () => transitionSchema?.additionalParameters?.uiSchema || {},
    [transitionSchema],
  );

  return {
    jsonSchema,
    uiSchema,
  };
};
