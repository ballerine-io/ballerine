import {
  JSONFormElementBaseParams,
  JSONFormElementParams,
} from '@app/components/organisms/DynamicElements/ui-elements/JSONForm/JSONForm';
import { UIElement } from '@app/domains/collection-flow';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const createFormSchemaFromUIElements = (formElement: UIElement<JSONFormElementParams>) => {
  const formSchema: RJSFSchema = {
    type: 'object',
    required: formElement.options?.required ?? [],
    properties: {},
  };

  const uiSchema: UiSchema = {};

  (formElement.uiElements as UIElement<JSONFormElementBaseParams>[])?.forEach(uiElement => {
    if (!uiElement.options?.jsonFormDefinition) return;

    formSchema.properties[uiElement.name] = uiElement.options.jsonFormDefinition || {};

    uiElement[uiElement.name] = uiElement.options?.uiSchema || {};
  });

  return {
    formSchema,
    uiSchema,
  };
};
