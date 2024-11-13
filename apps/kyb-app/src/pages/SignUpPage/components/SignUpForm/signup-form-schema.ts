import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const signupFormSchema: RJSFSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
    },
  },
};

export const signupFormUiSchema: UiSchema = {};
