import { RJSFSchema } from '@rjsf/utils';

export const formSchema: RJSFSchema = {
  title: 'Business documents',
  type: 'object',
  properties: {
    registrationCertificate: {
      title: 'Company Certificate of Registration',
      type: 'string',
    },
    addressProof: {
      title: 'Utility bill as proof of address of the company',
      type: 'string',
    },
  },
  required: ['registrationCertificate', 'addressProof'],
};
