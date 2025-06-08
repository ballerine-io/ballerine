import { IFormElement } from '../../../../types';
import { IEntityFieldGroupParams } from '../../EntityFieldGroup';

export const isEntityFieldGroupDefinition = (
  element: IFormElement<any, any>,
): element is IFormElement<'entityfieldgroup', IEntityFieldGroupParams> => {
  return element.element === 'entityfieldgroup';
};
