import { RJSFSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
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
      title: 'Company Email',
    },
    phone: {
      type: 'number',
      title: 'Phone Number',
    },
    companyName: {
      type: 'string',
      title: 'Company Name',
    },
  },
  required: ['firstName', 'lastName', 'email', 'phone', 'companyName'],
};
