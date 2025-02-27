import { IDocumentTemplate } from '../../../..';

export const checkIfDocumentRequested = <
  TResultDocument extends { id: string; status: string; decision: string } = {
    id: string;
    status: string;
    decision: string;
  },
>(
  document?: IDocumentTemplate<any> | undefined,
): document is IDocumentTemplate<TResultDocument> =>
  Boolean(document?._document?.status === 'requested' && document?._document?.id);

export const checkIfDocumentInRevision = <
  TResultDocument extends { id: string; decision: string } = {
    id: string;
    decision: string;
  },
>(
  document?: IDocumentTemplate<any> | undefined,
): document is IDocumentTemplate<TResultDocument> =>
  Boolean(document?._document?.decision === 'revisions' && document?._document?.id);
