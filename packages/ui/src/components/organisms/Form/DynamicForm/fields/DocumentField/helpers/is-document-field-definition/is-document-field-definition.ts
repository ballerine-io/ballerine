import { IDocumentFieldParams } from '../../..';
import { IFormElement, TBaseFields } from '../../../../types';

export const isDocumentFieldDefinition = (
  element: IFormElement<any, any>,
): element is IFormElement<TBaseFields, IDocumentFieldParams> => {
  return element.element === 'documentfield';
};
