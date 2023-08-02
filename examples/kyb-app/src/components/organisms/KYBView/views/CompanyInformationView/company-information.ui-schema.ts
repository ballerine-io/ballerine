import { UiSchema } from '@rjsf/utils';

export const companyInformationUISchema: UiSchema = {
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
  },
  establishmentDate: {
    'ui:field': 'DateInput',
  },
};
