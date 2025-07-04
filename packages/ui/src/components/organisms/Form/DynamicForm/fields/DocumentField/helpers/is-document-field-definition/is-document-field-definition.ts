import { GetUIElementByType, TUIElement } from '@ballerine/common';

export const isDocumentFieldDefinition = (
  element: TUIElement,
): element is GetUIElementByType<'documentfield'> => {
  return element.element === 'documentfield';
};
