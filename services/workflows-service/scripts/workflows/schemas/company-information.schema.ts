import { getCountriesList } from '../utils/countries';

export const companyInformationSchema = {
  type: 'object',
  title: 'Company Information',
  properties: {
    registrationNumber: {
      title: 'Company Registration Number',
      type: 'string',
      minLength: 1,
    },
    companyCountry: {
      title: 'Registered Country',
      type: 'string',
      oneOf: [
        // Line below should removed in case when field is required.
        { const: '', title: '' },
        ...getCountriesList().map(countryData => ({
          const: countryData.isoCode,
          title: countryData.fullName,
        })),
      ],
    },
    state: {
      title: 'Jurisdiction / State',
      type: 'string',
    },
    companyName: {
      title: 'Company Legal Name',
      type: 'string',
      minLength: 1,
    },
    vat: {
      title: 'VAT Number',
      type: 'string',
    },
    companyType: {
      title: 'Company Type',
      type: 'string',
      minLength: 1,
    },
    registrationDate: {
      title: 'Date of Establishment',
      type: 'string',
      minLength: 1,
    },
  },
  required: ['registrationNumber', 'companyType', 'state', 'companyName', 'registrationDate'],
};

export const companyInformationUISchema = {
  'ui:order': [
    'registrationNumber',
    'companyCountry',
    'state',
    'companyName',
    'vat',
    'companyType',
    'registrationDate',
  ],
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  registrationNumber: {
    'ui:placeholder': 'CRN12345678',
  },
  companyCountry: {
    'ui:placeholder': 'Select country',
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

export const defaultCompanyInformationData = {
  registrationNumber: '',
  companyCountry: '',
  companyName: '',
  companyType: '',
  state: '',
  vat: '',
  registrationDate: '',
};
