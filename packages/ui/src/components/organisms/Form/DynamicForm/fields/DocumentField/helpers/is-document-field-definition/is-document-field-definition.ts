import { IDocumentFieldParams } from '../../..';
import { IFormElement } from '../../../../types';

export const isDocumentFieldDefinition = (
  element: IFormElement<any, any>,
): element is IFormElement<'documentfield', IDocumentFieldParams> => {
  return element.element === 'documentfield';
};
