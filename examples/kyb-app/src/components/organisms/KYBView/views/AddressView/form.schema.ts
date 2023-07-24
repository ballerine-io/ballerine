import { RJSFSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
  title: 'Business address',
  type: 'object',
  properties: {
    address: {
      title: 'Full Address',
      type: 'string',
    },
  },
  required: ['address'],
};
