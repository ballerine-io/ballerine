import { EDocumentType, IDocument, IPageSide } from './types';

export const getDocImage = (
  type: EDocumentType,
  docs: IDocument[],
  pageSide?: IPageSide,
): string => {
  const doc = docs.find(d => d.type === type);
  if (!doc) return '';
  const page = doc.pages.find(p => p.side === pageSide) || doc.pages[0];
  if (!page) return '';
  return page.base64 as string;
};
