import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const signupFormSchema: RJSFSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      maxLength: 50,
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      maxLength: 50,
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
      maxLength: 254,
    },
  },
};

export const signupFormUiSchema: UiSchema = {};
