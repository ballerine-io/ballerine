import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { IDocumentFieldParams, IDocumentTemplate } from '../../../../DocumentField';

export const getDocumentObjectFromDocumentsList = (
  documentsList: Array<IDocumentFieldParams['template']> = [],
  element: IFormElement<'documentfield', IDocumentFieldParams>,
) => {
  const { template } = element.params || {};

  const documentIndex = documentsList?.findIndex(document => document.id === template?.id);

  if (documentIndex === -1) {
    return undefined;
  }

  return documentsList[documentIndex] as IDocumentTemplate<any> | undefined;
};
