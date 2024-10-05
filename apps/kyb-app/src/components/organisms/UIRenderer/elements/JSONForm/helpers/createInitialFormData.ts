import { JSONFormElementBaseParams } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElementDefinition } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import get from 'lodash/get';

export const createInitialFormData = (
  definition: UIElementDefinition<JSONFormElementBaseParams>,
  context: AnyObject,
) => {
  let formData: AnyObject | AnyObject[] = {};

  if (
    !definition.options?.jsonFormDefinition?.type ||
    definition.options?.jsonFormDefinition?.type === 'object'
  ) {
    definition.elements?.forEach(element => {
      // @ts-ignore
      formData[element.name] = get(context, element.valueDestination) as unknown;
    });
  }

  if (definition.options?.jsonFormDefinition?.type === 'array') {
    // @ts-ignore
    formData = (get(context, definition.valueDestination) as AnyObject[]) || [];

    return [...(formData as AnyObject[])];
  }

  return formData;
};
