export const companyDocumentsSchema = {
  title: 'Business documents',
  type: 'object',
  properties: {
    bankStatement: {
      title: 'Bank Statement',
      type: 'object',
      description: 'Not older than 6 months.',
    },
    companyStructure: {
      title: 'Company structure (directors & legal representatives)',
      type: 'object',
    },
    registrationCertificate: {
      title: 'Company Certificate of Registration',
      type: 'object',
    },
    addressProof: {
      title: 'Utility bill as proof of address of the company',
      type: 'object',
    },
    // To make fields optional
    // Set type to type: ['null', 'object']
    // Set default values to null
  },
  required: ['bankStatement', 'companyStructure', 'registrationCertificate', 'addressProof'],
};

export const companyDocumentsUISchema = {
  'ui:order': ['bankStatement', 'companyStructure', 'registrationCertificate', 'addressProof'],
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Submit',
    },
  },
  registrationCertificate: {
    'ui:field': 'FileInput',
  },
  addressProof: {
    'ui:field': 'FileInput',
  },
  bankStatement: {
    'ui:field': 'FileInput',
  },
  companyStructure: {
    'ui:field': 'FileInput',
  },
};

export const defaultCompanyDocumentsData = {
  registrationCertificate: null,
  addressProof: null,
  bankStatement: null,
  companyStructure: null,
};
