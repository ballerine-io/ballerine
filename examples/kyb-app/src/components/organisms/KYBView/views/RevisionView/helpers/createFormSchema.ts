import { createPageFieldName } from '@app/components/organisms/KYBView/views/RevisionView/helpers/page-utils';
import { Workflow } from '@app/domains/workflows/types';
import { RJSFSchema } from '@rjsf/utils';

//Temp solution to hardcode titles on client for KYB workflow
const titlesMap = {
  [import.meta.env.VITE_KYB_DEFINITION_ID]: 'Business documents',
  certificate_of_incorporation: 'Company Certificate of Registration',
  utility_bill: 'Utility bill as proof of address of the company',
} as const;

const DEFAULT_TITLE = 'Revision';

export const createFormSchema = (workflow: Workflow): RJSFSchema => {
  const schema: RJSFSchema = {};
  const documents = workflow.context.documents.filter(
    document => document.decision && document.decision.status === 'revision',
  );

  schema.type = 'object';
  schema.title = (titlesMap[workflow.workflowDefinitionId] || DEFAULT_TITLE) as string;
  schema.properties = documents.reduce((properties, document) => {
    properties[document.type] = {
      type: 'object',
      title: '',
      properties: document.pages.reduce((properties, page, index) => {
        const propertyName = createPageFieldName({ ...page, index });

        properties[propertyName] = {
          title: (titlesMap[document.type] || '') as string,
          type: 'string',
        };

        return properties;
      }, {} as RJSFSchema['properties']),
      // required: document.pages.map((_, index) => `page:${index}`),
    };
    return properties;
  }, {} as RJSFSchema['properties']);

  // schema.required = documents.map(doc => doc.type);

  return schema;
};
