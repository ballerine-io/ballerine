import { AnyObject } from '@/common';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { get } from 'lodash';
import { IDocumentFieldParams } from '../../../../DocumentField';
import { buildDocumentFormData } from '../../../../DocumentField/helpers/build-document-form-data';
import { getFileOrFileIdFromDocumentsList } from '../../../../DocumentField/hooks/useDocumentUpload/helpers/get-file-or-fileid-from-documents-list';
import { IEntityFieldGroupParams } from '../../../EntityFieldGroup';

interface IDocumentCreationDependencies {
  workflowId: string;
  entityId: string;
  stack: TDeepthLevelStack;
}

export interface IDocumentCreationResult {
  payload: FormData;
  documentDefinition: IFormElement<any, IDocumentFieldParams>;
  valueDestination: string;
}

export const buildDocumentsCreationPayload = (
  element: IFormElement<any, IEntityFieldGroupParams>,
  context: AnyObject,
  dependencies: IDocumentCreationDependencies,
): IDocumentCreationResult[] => {
  const documentElements = (element.children?.filter(child => child.element === 'documentfield') ||
    []) as Array<IFormElement<any, IDocumentFieldParams>>;

  if (!documentElements?.length) {
    return [];
  }

  const { entityId, stack } = dependencies;
  const documentPayload: IDocumentCreationResult[] = [];

  for (let index = 0; index < documentElements.length; index++) {
    const documentElement = documentElements[index]!;
    const documentDestination = formatValueDestination(documentElement.valueDestination, [
      ...(stack || []),
      index,
    ]);

    const documentFile = getFileOrFileIdFromDocumentsList(
      get(context, documentDestination),
      documentElement,
    );

    if (!documentFile || !(documentFile instanceof File)) {
      continue;
    }

    if (!documentElement?.params?.template) {
      console.warn('No template found for document field', documentElement);
      continue;
    }

    const payload = buildDocumentFormData(documentElement, { entityId }, documentFile);

    documentPayload.push({
      payload,
      documentDefinition: documentElement,
      valueDestination: documentDestination,
    });
  }

  return documentPayload;
};
