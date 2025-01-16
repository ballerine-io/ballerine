import { IDocumentFieldParams } from '../../../..';

export const removeDocumentFromListByTemplateId = (
  documents: Array<IDocumentFieldParams['template']> = [],
  templateId: string,
) => {
  const isDocumentInList = documents.some(document => document.id === templateId);

  if (!isDocumentInList) {
    return documents;
  }

  return documents.filter(document => document.id !== templateId);
};
