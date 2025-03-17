import { IDocumentTemplate } from '@/common/ui-definition-parse-utils/types';
import { AnyRecord } from '@ballerine/common';
import { Document, UiDefinition } from '@prisma/client';
import get from 'lodash/get';
import set from 'lodash/set';
import { findDocumentDefinitionByTypeAndCategory } from './find-document-definition-by-type-and-category';

export const addRequestedDocumentToBusinessEntityDocuments = (
  context: AnyRecord,
  entityType: 'business' | 'ubo' | 'director',
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
  if (entityType !== 'business') {
    throw new Error('Business entity type is not supported.');
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
    _document: {
      id: createdDocument.id,
    },
  };
  documents.push(documentTemplate);

  set(context, 'documents', documents);

  return context;
};
