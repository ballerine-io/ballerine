import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
  type: 'object',
  required: ['name', 'displayName'],
  properties: {
    name: {
      type: 'string',
    },
    displayName: {
      type: 'string',
    },
  },
};

export const uiSchema: UiSchema = {
  name: {
    'ui:placeholder': 'mikashboks',
    'ui:label': 'Name',
  },
  displayName: {
    'ui:placeholder': 'MiKashBoks',
    'ui:label': 'Display Name',
  },
};
