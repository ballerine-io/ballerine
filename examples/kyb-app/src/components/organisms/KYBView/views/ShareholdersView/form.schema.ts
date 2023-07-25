import { RJSFSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
  title: 'Shareholders/UBOs',
  description:
    'Add all natural persons that own or control, directly or Indirectly more than 25% of the Company.',
  type: 'array',
  minItems: 1,
  items: {
    title: 'Shareholder',
    type: 'object',
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
        format: 'email',
        title: 'Email',
      },
    },
    required: ['firstName', 'lastName', 'email'],
  },
};
