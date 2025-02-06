import { AnyObject } from '@/common';
import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { formatValueDestination, TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { get } from 'lodash';
import { IDocumentFieldParams } from '../../../../DocumentField';
import { IEntityFieldGroupParams } from '../../../EntityFieldGroup';
import { IEntity } from '../../../types';

interface IDocumentCreationDependencies {
  workflowId: string;
  entityId: string;
  stack: TDeepthLevelStack;
}

export interface IDocumentCreationResult {
  payload: FormData;
  valueDestination: string;
}

export const buildDocumentsCreationPayload = (
  element: IFormElement<any, IEntityFieldGroupParams>,
  entity: IEntity & Record<string, any>,
  context: AnyObject,
  dependencies: IDocumentCreationDependencies,
): IDocumentCreationResult[] => {
  const documentElements = (element.children?.filter(child => child.element === 'documentfield') ||
    []) as Array<IFormElement<any, IDocumentFieldParams>>;

  if (!documentElements?.length) {
    return [];
  }

  const { workflowId, entityId, stack } = dependencies;
  const documentPayload: IDocumentCreationResult[] = [];

  for (let index = 0; index < documentElements.length; index++) {
    const documentElement = documentElements[index]!;
    const documentDestination = formatValueDestination(documentElement.valueDestination, [
      ...(stack || []),
      index,
    ]);

    const documentFile = get(context, documentDestination);

    if (!documentFile) {
      continue;
    }

    if (!documentElement?.params?.template) {
      console.warn('No template found for document field', documentElement);
      continue;
    }

    const { template } = documentElement.params;
    const payload = new FormData();

    payload.append('category', template?.category as string);
    payload.append('type', template?.type as string);
    payload.append('issuingVersion', template?.issuingVersion as unknown as string);
    payload.append('version', template?.version as string);
    payload.append('status', 'provided');
    payload.append(
      'properties',
      JSON.stringify(documentElement.params?.template?.properties || {}),
    );
    payload.append('workflowRuntimeDataId', workflowId);
    payload.append('issuingCountry', template?.issuer?.country as string);
    payload.append('endUserId', entityId);
    payload.append('file', documentFile);
    payload.append(
      'metadata',
      JSON.stringify({
        type: documentElement.params?.documentType,
        variant: documentElement.params?.documentVariant,
        page: Number(documentElement.params?.pageIndex || 0) + 1,
      }),
    );

    documentPayload.push({
      payload,
      valueDestination: documentDestination,
    });
  }

  return documentPayload;
};
