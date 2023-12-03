import {
  JSONFormElementBaseParams,
  JSONFormElementParams,
} from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const createFormSchemaFromUIElements = (formElement: UIElement<JSONFormElementParams>) => {
  const formSchema: RJSFSchema = {
    type: formElement.options?.jsonFormDefinition?.type === 'array' ? 'array' : 'object',
    required: formElement.options?.jsonFormDefinition?.required ?? [],
  };

  const uiSchema: UiSchema = {
    'ui:submitButtonOptions': {
      norender: true,
    },
    titleTemplate: 'blah',
  };

  if (formSchema.type === 'object') {
    formSchema.properties = {};

    (formElement.elements as UIElement<JSONFormElementBaseParams>[])?.forEach(uiElement => {
      if (!uiElement.options?.jsonFormDefinition) return;

      const elementDefinition = {
        ...uiElement.options.jsonFormDefinition,
        title: uiElement.options.label,
        description: uiElement.options.description,
      };

      if (!formSchema.properties) {
        formSchema.properties = {};
      }

      formSchema.properties[uiElement.name] = elementDefinition;

      uiSchema[uiElement.name] = {
        ...uiElement?.options?.uiSchema,
        'ui:label':
          (uiElement.options?.uiSchema || {})['ui:label'] === undefined
            ? Boolean(uiElement?.options?.label)
            : (uiElement.options?.uiSchema || {})['ui:label'],
        'ui:placeholder': uiElement?.options?.hint,
      };
    });
  }

  if (formSchema.type === 'array') {
    uiSchema.titleTemplate = formElement.options?.uiSchema?.titleTemplate as string;
    formSchema.items = {
      type: 'object',
      required: formElement.options?.jsonFormDefinition?.required,
      title: formElement.options?.jsonFormDefinition?.title,
      properties: {},
    };

    uiSchema.items = {
      'ui:label': false,
    } as AnyObject;

    (formElement.elements as UIElement<JSONFormElementBaseParams>[])?.forEach(uiElement => {
      if (!uiElement.options?.jsonFormDefinition) return;

      const elementDefinition = {
        ...uiElement.options.jsonFormDefinition,
        title: uiElement.options.label,
        description: uiElement.options.description,
      };

      if (!(formSchema.items as RJSFSchema)?.properties) {
        (formSchema.items as RJSFSchema).properties = {};
      }

      // @ts-ignore
      (formSchema.items as RJSFSchema).properties[uiElement.name] = elementDefinition;

      uiSchema.items[uiElement.name] = {
        ...uiElement?.options?.uiSchema,
        'ui:label': Boolean(uiElement?.options?.label),
        'ui:placeholder': uiElement?.options?.hint,
      };
    });
  }

  return {
    formSchema,
    uiSchema,
  };
};
