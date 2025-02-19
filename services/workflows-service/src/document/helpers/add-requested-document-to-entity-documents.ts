import { AnyRecord } from '@ballerine/common';
import { Document, UiDefinition } from '@prisma/client';
import get from 'lodash/get';
import set from 'lodash/set';

export interface IDocumentTemplate {
  id: string;
  category: string;
  type: string;
  issuer: {
    country: string;
  };
  version: number;
  issuingVersion: number;
  properties: AnyRecord;
  pages: AnyRecord[];
  status?: Document['status'];
  decision?: Document['decision'];
  // Id of an document without file.
  _id: string;
}

interface IUIDefinitionPage {
  elements: IUIDefinitionElement[];
}

export interface IUIDefinitionElement {
  element: string;
  params?: {
    template?: {
      id: string;
      type: string;
      category: string;
    };
  };
  children?: IUIDefinitionElement[];
}

const findDocumentDefinitionByTypeAndCategory = (
  type: string,
  category: string,
  uiDefinition: UiDefinition,
): IUIDefinitionElement | undefined => {
  let result: IUIDefinitionElement | undefined = undefined;
  const pages = (uiDefinition.uiSchema as unknown as { elements: IUIDefinitionPage[] }).elements;

  const run = (elements: IUIDefinitionElement[]) => {
    for (const element of elements) {
      if (
        element.element === 'documentfield' &&
        element?.params?.template?.type === type &&
        element?.params?.template?.category === category
      ) {
        result = element;
        break;
      }

      if (element?.children) {
        run(element.children);
      }
    }
  };

  pages.forEach(page => {
    run(page.elements);
  });

  return result;
};

export const addRequestedDocumentToEntityDocuments = (
  context: AnyRecord,
  entityType: 'ubo' | 'director' | 'business',
  uiDefinition: UiDefinition,
  createdDocument: {
    id: string;
    type: string;
    category: string;
    issuingCountry: string;
    issuingVersion: string;
    version: string;
    status: Document['status'];
    decision: Document['decision'];
  },
) => {
  if (entityType === 'ubo' || entityType === 'director') {
    throw new Error('Requested documents are not supported for UBOs or Directors.');
  }

  const documents = get(context, 'documents', []) as IDocumentTemplate[];

  const documentDefintion = findDocumentDefinitionByTypeAndCategory(
    createdDocument.type,
    createdDocument.category,
    uiDefinition,
  );

  if (!documentDefintion) {
    return;
  }

  const documentTemplate: IDocumentTemplate = {
    id: documentDefintion?.params?.template?.id as string,
    category: createdDocument.category,
    type: createdDocument.type,
    issuer: {
      country: createdDocument.issuingCountry,
    },
    version: Number(createdDocument.version),
    issuingVersion: Number(createdDocument.issuingVersion),
    properties: {} as AnyRecord,
    pages: [],
    status: createdDocument.status,
    decision: createdDocument.decision,
    _id: createdDocument.id,
  };
  documents.push(documentTemplate);

  set(context, 'documents', documents);

  return context;
};
