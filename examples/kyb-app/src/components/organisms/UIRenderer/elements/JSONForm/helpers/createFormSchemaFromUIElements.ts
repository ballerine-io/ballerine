import {
  JSONFormElementBaseParams,
  JSONFormElementParams,
} from '@app/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElement } from '@app/domains/collection-flow';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const createFormSchemaFromUIElements = (formElement: UIElement<JSONFormElementParams>) => {
  const formSchema: RJSFSchema = {
    type: formElement.options?.jsonFormDefinition.type === 'array' ? 'array' : 'object',
    required: formElement.options?.jsonFormDefinition?.required ?? [],
  };

  const uiSchema: UiSchema = {
    'ui:submitButtonOptions': {
      norender: true,
    },
  };

  if (formSchema.type === 'object') {
    formSchema.properties = {};

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
  }

  if (formSchema.type === 'array') {
    formSchema.items = {
      type: 'object',
      properties: {},
    };

    (formElement.elements as UIElement<JSONFormElementBaseParams>[])?.forEach(uiElement => {
      if (!uiElement.options?.jsonFormDefinition) return;

      const elementDefinition = {
        ...uiElement.options.jsonFormDefinition,
        title: uiElement.options.label,
      };

      //@ts-nocheck
      (formSchema.items as RJSFSchema).properties[uiElement.name] = elementDefinition;

      const elementUISchema = {
        ...uiElement?.options?.uiSchema,
        'ui:label': Boolean(uiElement?.options?.label),
        'ui:placeholder': uiElement?.options?.hint,
      };

      uiSchema[uiElement.name] = elementUISchema;
    });
  }

  return {
    formSchema,
    uiSchema,
  };
};
