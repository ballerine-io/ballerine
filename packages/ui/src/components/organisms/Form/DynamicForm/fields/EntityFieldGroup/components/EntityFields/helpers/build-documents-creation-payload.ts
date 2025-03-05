import { AnyObject } from '@/common';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { get } from 'lodash';
import {
  getDocumentObjectFromDocumentsList,
  IDocumentFieldParams,
} from '../../../../DocumentField';
import { buildDocumentFormData } from '../../../../DocumentField/helpers/build-document-form-data';
import { getFileOrFileIdFromDocumentsList } from '../../../../DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { IEntityFieldGroupParams } from '../../../EntityFieldGroup';

export interface IDocumentCreationResult {
  payload: FormData;
  documentDefinition: IFormElement<any, IDocumentFieldParams>;
  valueDestination: string;
}

export const buildDocumentsCreationPayload = (
  element: IFormElement<any, IEntityFieldGroupParams>,
  entityIds: string[],
  context: AnyObject,
  stack: TDeepthLevelStack,
): IDocumentCreationResult[] => {
  const documentElements = (element.children?.filter(child => child.element === 'documentfield') ||
    []) as Array<IFormElement<any, IDocumentFieldParams>>;

  if (!documentElements?.length) {
    return [];
  }

  const documentPayload: IDocumentCreationResult[] = [];

  // Outer loop for correct index calculation
  for (let entityIndex = 0; entityIndex < entityIds.length; entityIndex++) {
    const entityId = entityIds[entityIndex];

    // Inner loop for document elements, each entity can have multiple document fields
    for (const documentElement of documentElements) {
      if (!documentElement?.params?.template) {
        console.warn('No template found for document field', documentElement);
        continue;
      }

      const documentDestination = formatValueDestination(documentElement.valueDestination, [
        ...(stack || []),
        entityIndex,
      ]);

      const documentsList = get(context, documentDestination, []);

      const document = getDocumentObjectFromDocumentsList(documentsList, documentElement);

      // Document already created
      if (document?._document?.id) {
        continue;
      }

      const documentFile = getFileOrFileIdFromDocumentsList(documentsList, documentElement);

      if (!documentFile || !(documentFile instanceof File)) {
        continue;
      }

      const payload = buildDocumentFormData(documentElement, { entityId }, documentFile);

      documentPayload.push({
        payload,
        documentDefinition: documentElement,
        valueDestination: documentDestination,
      });
    }
  }

  return documentPayload;
};
