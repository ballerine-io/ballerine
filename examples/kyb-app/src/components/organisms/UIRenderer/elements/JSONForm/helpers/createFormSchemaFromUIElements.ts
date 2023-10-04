import {
  JSONFormElementBaseParams,
  JSONFormElementParams,
} from '@app/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElement } from '@app/domains/collection-flow';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const createFormSchemaFromUIElements = (formElement: UIElement<JSONFormElementParams>) => {
  const formSchema: RJSFSchema = {
    type: 'object',
    required: formElement.options?.jsonFormDefinition?.required ?? [],
    properties: {},
  };

  const uiSchema: UiSchema = {};

  (formElement.elements as UIElement<JSONFormElementBaseParams>[])?.forEach(uiElement => {
    if (!uiElement.options?.jsonFormDefinition) return;

    const elementDefinition = {
      ...uiElement.options.jsonFormDefinition,
      title: uiElement.options.label,
    };

    formSchema.properties[uiElement.name] = elementDefinition;

    const elementUISchema = {
      ...uiElement?.options?.uiSchema,
      'ui:label': Boolean(uiElement?.options?.label),
      'ui:placeholder': uiElement?.options?.hint,
    };

    uiSchema[uiElement.name] = elementUISchema;
  });

  console.log('ui schema', uiSchema);

  return {
    formSchema,
    uiSchema,
  };
};
