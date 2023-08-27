import { RJSFSchema } from '@rjsf/utils';

export const signinSchema: RJSFSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      title: 'Company Email',
      type: 'string',
      format: 'email',
    },
  },
};
