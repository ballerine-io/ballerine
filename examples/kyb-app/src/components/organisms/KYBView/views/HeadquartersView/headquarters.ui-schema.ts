import { UiSchema } from '@rjsf/utils';

export const headquartersUISchema: UiSchema = {
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  address: {
    'ui:placeholder': '10 Downing Street, London, UK, SW1A 2AA',
  },
  street: {
    'ui:placeholder': '10 Downing Street',
  },
  postalCode: {
    'ui:placeholder': 'SW1A 2AA',
  },
  city: {
    'ui:placeholder': 'London',
  },
  state: {
    'ui:placeholder': 'N/A',
  },
  country: {
    'ui:placeholder': 'United Kingdom',
  },
  phone: {
    'ui:field': 'PhoneInput',
    'ui:label': true,
  },
};
