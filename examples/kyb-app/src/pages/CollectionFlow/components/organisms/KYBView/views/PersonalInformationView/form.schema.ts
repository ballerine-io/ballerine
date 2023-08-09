import { RJSFSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
  type: 'object',
  title: 'Personal information',
  properties: {
    name: {
      type: 'object',
      title: '',
      properties: {
        firstName: {
          title: 'Name',
          type: 'string',
          minLength: 1,
        },
        lastName: {
          title: '',
          type: 'string',
          minLength: 1,
        },
      },
      required: ['firstName', 'lastName'],
    },
    title: {
      title: 'Title',
      type: 'string',
      minLength: 1,
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Company Email',
    },
    birthDate: {
      type: 'string',
      format: 'date',
      title: 'Date of Birth',
    },
    phone: {
      type: 'string',
      title: 'Phone Number',
      minLength: 1,
    },
    companyCheck: {
      title: 'dfrd',
      type: 'boolean',
      description: 'I have the signing authority for this company',
      default: true,
    },
  },
  required: ['name', 'title', 'email', 'birthDate'],
};
