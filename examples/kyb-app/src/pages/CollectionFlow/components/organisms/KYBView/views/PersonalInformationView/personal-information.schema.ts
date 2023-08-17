import { RJSFSchema } from '@rjsf/utils';

export const personalInformationSchema: RJSFSchema = {
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
    birthDate: {
      type: 'string',
      title: 'Date of Birth',
      minLength: 1,
      format: 'date-time',
    },
    phoneNumber: {
      type: 'string',
      title: 'Phone Number',
      minLength: 1,
    },
    companyCheck: {
      title: 'I have the signing authority for this company',
      type: 'boolean',
    },
  },
  required: ['name', 'title', 'birthDate', 'phoneNumber'],
};
