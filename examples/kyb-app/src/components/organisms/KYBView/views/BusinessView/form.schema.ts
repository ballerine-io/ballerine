import { RJSFSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
  type: 'object',
  title: 'Business information',
  properties: {
    registrationNumber: {
      title: 'Registration number',
      type: 'string',
      format: '/^d+$/',
    },
    website: {
      title: 'Website',
      type: 'string',
    },
  },
  required: ['registrationNumber', 'website'],
};
