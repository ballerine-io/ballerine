import { IFormElement } from '../../../../types';
import { IDocumentFieldParams, IDocumentTemplate } from '../../DocumentField';
import {
  checkIfDocumentInRevision,
  checkIfDocumentRequested,
} from '../../hooks/useDocumentUpload/helpers/check-if-document-requested';

export const buildDocumentFormData = (
  element: IFormElement<'documentfield', IDocumentFieldParams>,
  { entityId, businessId }: { entityId?: string; businessId?: string },
  file: File,
  document?: IDocumentTemplate,
) => {
  if (!element.params) {
    throw new Error('Document field params are required');
  }

  const { template, documentType, documentVariant, pageIndex = 0 } = element.params;

  const payload = new FormData();

  payload.append('category', template?.category as string);
  payload.append('type', template?.type as string);
  payload.append('issuingVersion', template?.issuingVersion as unknown as string);
  payload.append('version', template?.version as unknown as string);
  payload.append('status', 'provided');
  payload.append('properties', JSON.stringify(template.properties || {}));
  payload.append('issuingCountry', template?.issuer?.country as string);
  payload.append('decisionReason', '');

  if (checkIfDocumentRequested(document)) {
    payload.append('documentId', document._document?.id as string);
  }

  if (checkIfDocumentInRevision(document)) {
    payload.append('documentId', document._document?.id as string);
  }

  if (entityId) {
    payload.append('endUserId', entityId);
  }

  if (businessId) {
    payload.append('businessId', businessId);
  }

  payload.append('file', file as File, file.name);
  payload.append(
    'metadata',
    JSON.stringify({
      type: documentType,
      variant: documentVariant,
      page: pageIndex + 1,
    }),
  );

  return payload;
};
