import { RJSFSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
  type: 'object',
  title: 'Personal information',
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
      type: 'string',
      title: 'Phone Number',
      format: '/^(?:+?d{1,3}[ -]?)?(?:(d{1,3})[ -]?)?d{3}[ -]?d{3}[ -]?d{4}$/',
    },
    companyName: {
      type: 'string',
      title: 'Company Name',
    },
  },
  required: ['firstName', 'lastName', 'email', 'phone', 'companyName'],
};
