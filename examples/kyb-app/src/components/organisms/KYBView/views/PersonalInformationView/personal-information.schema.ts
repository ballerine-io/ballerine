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
        },
        lastName: {
          title: '',
          type: 'string',
        },
      },
      required: ['firstName', 'lastName'],
    },
    title: {
      title: 'Title',
      type: 'string',
    },
    birthDate: {
      type: 'string',
      title: 'Date of Birth',
    },
    phoneNumber: {
      type: 'string',
      title: 'Phone Number',
    },
    companyCheck: {
      title: 'dfrd',
      type: 'boolean',
      description: 'I have the signing authority for this company',
      default: true,
    },
  },
  required: ['name', 'title', 'birthDate', 'phoneNumber'],
};
