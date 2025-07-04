import { GetUIElementByType, TUIElement } from '@ballerine/common';

export const isEntityFieldGroupDefinition = (
  element: TUIElement,
): element is GetUIElementByType<'entityfieldgroup'> => {
  return element.element === 'entityfieldgroup';
};
