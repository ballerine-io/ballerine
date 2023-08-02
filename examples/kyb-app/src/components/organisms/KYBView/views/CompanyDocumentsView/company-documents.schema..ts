import { RJSFSchema } from '@rjsf/utils';

export const companyDocumentsSchema: RJSFSchema = {
  title: 'Business documents',
  type: 'object',
  properties: {
    bankStatement: {
      title: 'Bank Statement',
      type: 'string',
      description: 'Not older than 6 months.',
    },
    companyStructure: {
      title: 'Company structure (directors & legal representatives)',
    },
    registrationCertificate: {
      title: 'Company Certificate of Registration',
      type: 'string',
    },
    addressProof: {
      title: 'Utility bill as proof of address of the company',
      type: 'string',
    },
  },
  required: ['bankStatement', 'companyStructure', 'registrationCertificate', 'addressProof'],
};
