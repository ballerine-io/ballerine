import { IDocumentTemplate } from '../../../..';

export const checkIfDocumentRequested = (
  document?: IDocumentTemplate,
): document is IDocumentTemplate & { _id: string } =>
  Boolean(document?.status === 'requested' && document?._id);

export const checkIfDocumentInRevision = (
  document?: IDocumentTemplate,
): document is IDocumentTemplate & { _id: string } => Boolean(document?.decision === 'revisions');
