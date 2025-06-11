import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  getFieldDefinitionsFromSchema,
  IDocument,
  IFormElement,
  IPriorityField,
  TBaseFields,
} from '@ballerine/ui';
import { checkIfStepInRevision } from '../../../../helpers/check-if-step-in-revision';
import { generateGranularRevisionFields } from './helpers/generate-granular-revision-fields';
import { generateRevisionFieldsForAllElements } from './helpers/generate-revision-fields-for-all-elements';
import { checkIfStepInEdit } from '../../../../helpers/check-if-step-in-edit';
import { CollectionFlowStatusesEnum, getCollectionFlowState } from '@ballerine/common';

export const generateFieldsForRevision = (
  pages: Array<UIPage<'v2'>>,
  context: CollectionFlowContext,
  documents: IDocument[],
): IPriorityField[] | undefined => {
  let fieldsForRevision: IPriorityField[] = [];
  const collectionFlowState = getCollectionFlowState(context);

  pages.forEach(page => {
    const isPageInRevision = checkIfStepInRevision(page.stateName, context);
    const isPageInEdit = checkIfStepInEdit(page.stateName, context);
    const fieldDefinitions = getFieldDefinitionsFromSchema(page.elements) as Array<
      IFormElement<TBaseFields, any>
    >;

    if (isPageInRevision || isPageInEdit) {
      const granularRevisionFields = generateGranularRevisionFields({
        context,
        documents,
        elements: fieldDefinitions,
      });

      // If there specific fields to revise marking only them (Documents currently)
      if (granularRevisionFields.length) {
        fieldsForRevision = fieldsForRevision.concat(granularRevisionFields);
      } else {
        // If there are no specific fields to revise, mark all fields for revision
        fieldsForRevision = fieldsForRevision.concat(
          generateRevisionFieldsForAllElements(context, fieldDefinitions),
        );
      }
    }
  });

  if (collectionFlowState?.status === CollectionFlowStatusesEnum.revision) {
    return fieldsForRevision;
  }

  return fieldsForRevision.length ? fieldsForRevision : undefined;
};
