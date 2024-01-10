import { TWorkflowDefinition } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';

export const useFormSchema = (workflowDefinition: TWorkflowDefinition) => {
  const jsonSchema = useMemo(() => {
    return workflowDefinition?.inputSchema || { type: 'object' };
  }, [workflowDefinition]);

  const uiSchema = useMemo(
    () => ({
      data: {
        'ui:label': false,
        companyName: {
          'ui:title': 'Company Name',
        },
        additionalInfo: {
          'ui:label': false,
          companyName: {
            'ui:title': 'Hello World',
          },
          mainRepresentative: {
            'ui:label': false,
            'ui:order': ['email', 'firstName', 'lastName'],
            email: {
              'ui:title': 'Email',
            },
            firstName: {
              'ui:title': 'First Name',
            },
            lastName: {
              'ui:title': 'Last Name',
            },
          },
        },
      },
    }),
    [],
  );

  return {
    jsonSchema,
    uiSchema,
  };
};
