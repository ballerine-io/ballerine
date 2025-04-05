import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  getFieldDefinitionsFromSchema,
  IFormElement,
  IPriorityField,
  TBaseFields,
} from '@ballerine/ui';
import { checkIfStepInRevision } from '../../../../helpers/check-if-step-in-revision';
import { generateGranularRevisionFields } from './helpers/generate-granular-revision-fields';
import { generateRevisionFieldsForAllElements } from './helpers/generate-revision-fields-for-all-elements';

export const generateFieldsForRevision = (
  pages: Array<UIPage<'v2'>>,
  context: CollectionFlowContext,
): IPriorityField[] | undefined => {
  let fieldsForRevision: IPriorityField[] = [];

  pages.forEach(page => {
    const isPageInRevision = checkIfStepInRevision(page.stateName, context);
    const fieldDefinitions = getFieldDefinitionsFromSchema(page.elements) as Array<
      IFormElement<TBaseFields, any>
    >;

    if (isPageInRevision) {
      const granularRevisionFields = generateGranularRevisionFields(context, fieldDefinitions);
      fieldsForRevision = granularRevisionFields.length
        ? fieldsForRevision.concat(granularRevisionFields)
        : granularRevisionFields.length
        ? granularRevisionFields
        : fieldsForRevision.concat(generateRevisionFieldsForAllElements(context, fieldDefinitions));
    }
  });

  return fieldsForRevision.length ? fieldsForRevision : undefined;
};
