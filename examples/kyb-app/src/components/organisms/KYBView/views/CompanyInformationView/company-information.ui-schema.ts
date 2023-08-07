import { UiSchema } from '@rjsf/utils';

export const companyInformationUISchema: UiSchema = {
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  registrationNumber: {
    'ui:placeholder': 'CRN12345678',
  },
  companyCountry: {
    'ui:placeholder': 'United Kingdom',
  },
  companyName: {
    'ui:placeholder': 'OpenAI Technologies, Inc.',
  },
  vat: {
    'ui:placeholder': 'US-VAT-98765432',
  },
  companyType: {
    'ui:placeholder': 'Corporation',
    'ui:field': 'AutocompleteInput',
    'ui:label': true,
    options: [
      {
        title: 'Partnership',
        const: 'Partnership',
      },
      {
        title: 'Sole Proprietorship',
        const: 'Sole Proprietorship',
      },
      {
        title: 'General Partnership (GP)',
        const: 'General Partnership (GP)',
      },
      {
        title: 'Limited Partnership (LP)',
        const: 'Limited Partnership (LP)',
      },
      {
        title: 'Limited Liability Partnership (LLP)',
        const: 'Limited Liability Partnership (LLP)',
      },
      {
        title: 'Corporation',
        const: 'Corporation',
      },
      {
        title: 'C Corporation (C Corp)',
        const: 'C Corporation (C Corp)',
      },
      {
        title: 'S Corporation (S Corp)',
        const: 'S Corporation (S Corp)',
      },
      { title: 'Professional Corporation (PC)', const: 'Professional Corporation (PC)' },
      { title: 'Incorporated (Inc.)', const: 'Incorporated (Inc.)' },
      {
        title: 'Limited Liability Company (LLC)',
        const: 'Limited Liability Company (LLC)',
      },
      { title: 'Public Limited Company (PLC)', const: 'Public Limited Company (PLC)' },
      {
        title: 'Private Limited Company (Ltd)',
        const: 'Private Limited Company (Ltd)',
      },
      { title: 'Co-operative (Co-op)', const: 'Co-operative (Co-op)' },
      {
        title: 'Business Trust',
        const: 'Business Trust',
      },
      {
        title: 'Joint Venture',
        const: 'Joint Venture',
      },
      {
        title: 'Unlimited Company',
        const: 'Unlimited Company',
      },
      {
        title: 'Trust',
        const: 'Trust',
      },
      {
        title: 'Holding Company',
        const: 'Holding Company',
      },
    ].sort((a, b) => a.title.localeCompare(b.title)),
  },
  registrationDate: {
    'ui:field': 'DateInput',
    'ui:label': true,
  },
};
