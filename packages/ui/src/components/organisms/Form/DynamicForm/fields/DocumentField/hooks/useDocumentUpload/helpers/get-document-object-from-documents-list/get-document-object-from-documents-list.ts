import { GetUIElementByType } from '@ballerine/common';
import { IDocumentFieldParams, IDocumentTemplate } from '../../../../DocumentField';

export const getDocumentObjectFromDocumentsList = (
  documentsList: Array<IDocumentFieldParams['template']> = [],
  element: GetUIElementByType<'documentfield'>,
) => {
  const { template } = element.params || {};

  // TODO: fix template id
  //@ts-expect-error
  const documentIndex = documentsList?.findIndex(document => document.id === template?.id);

  if (documentIndex === -1) {
    return undefined;
  }

  return documentsList[documentIndex] as IDocumentTemplate<any> | undefined;
};
