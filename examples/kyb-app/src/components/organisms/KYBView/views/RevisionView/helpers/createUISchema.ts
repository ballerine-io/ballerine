import { createPageFieldName } from '@app/components/organisms/KYBView/views/RevisionView/helpers/page-utils';
import { Workflow } from '@app/domains/workflows/types';
import { AnyObject } from '@ballerine/ui';
import { UiSchema } from '@rjsf/utils';

export const createUISchema = (workflow: Workflow): UiSchema => {
  const uiSchema: UiSchema = workflow.context.documents
    .filter(document => document.decision && document.decision.status === 'revision')
    .reduce((schema, document) => {
      schema[document.type] = document.pages.reduce((schema, page, index) => {
        const propertyName = createPageFieldName({ ...page, index });
        schema[propertyName] = {
          'ui:field': 'FileInput',
        };

        return schema;
      }, {} as AnyObject);

      return schema;
    }, {} as UiSchema);

  return uiSchema;
};
