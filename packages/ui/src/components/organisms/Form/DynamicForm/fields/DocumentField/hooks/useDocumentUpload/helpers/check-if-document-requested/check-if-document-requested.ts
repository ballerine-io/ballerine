import { IDocumentTemplate } from '../../../..';

export const checkIfDocumentRequested = (
  document?: IDocumentTemplate,
): document is IDocumentTemplate & { _id: string } =>
  Boolean(document?.status === 'requested' && document?._id);
