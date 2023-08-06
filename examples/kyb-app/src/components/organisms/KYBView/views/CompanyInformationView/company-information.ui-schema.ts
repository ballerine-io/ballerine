import { UiSchema } from '@rjsf/utils';

export const companyInformationUISchema: UiSchema = {
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  registrationNumber: {
    'ui:placeholder': 'CRN12345678',
    'ui:disabled': true,
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
    'ui:label': true,
  },
  state: {
    'ui:disabled': true,
  },
};
