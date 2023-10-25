import { JSONFormElementParams } from '@app/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';

export const createInitialFormData = (
  definition: UIElement<JSONFormElementParams>,
  context: AnyObject,
) => {
  let formData: AnyObject | AnyObject[] = {};
  if (
    !definition.options?.jsonFormDefinition?.type ||
    definition.options?.jsonFormDefinition?.type === 'object'
  ) {
    definition.elements.forEach(element => {
      formData[element.name] = get(context, element.valueDestination) as unknown;
    });
  }

  if (definition.options?.jsonFormDefinition?.type === 'array') {
    formData = (get(context, definition.valueDestination) as AnyObject[]) || [];
  }

  return formData;
};
