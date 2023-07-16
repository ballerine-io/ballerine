import { RJSFSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
  type: 'object',
  properties: {
    information: {
      title: 'Business information',
      type: 'object',
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
    },
    address: {
      title: 'Business address',
      type: 'object',
      properties: {
        address: {
          title: 'Full Address',
          type: 'string',
        },
      },
      required: ['address'],
    },
    documents: {
      title: 'Business documents',
      type: 'object',
      properties: {
        registrationCertificate: {
          title: 'Company Certificate of Registration',
          type: 'string',
        },
        bill: {
          title: 'Utility bill as proof of address of the company',
          type: 'string',
        },
        // legal: {
        //   title: 'Company extract showing directors & legal representatives',
        //   type: 'string',
        // },
      },
      required: ['registrationCertificate', 'bill'],
    },
    shareholders: {
      title: 'Shareholders/UBOs',
      description:
        'Add all natural persons that own or control, directly or Indirectly more than 25% of the Company.',
      type: 'array',
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
    },
  },
  required: ['information', 'address', 'documents', 'shareholders'],
};
