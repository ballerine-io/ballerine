import { UiSchema } from '@rjsf/utils';

export const personalInformationUISchema: UiSchema = {
  phone: {
    'ui:field': 'PhoneInput',
    'ui:label': true,
  },
  birthDate: {
    'ui:field': 'DateInput',
  },
  name: {
    firstName: {
      'ui:placeholder': 'First Name',
      'ui:label': true,
    },
    lastName: {
      'ui:placeholder': 'Last Name',
      'ui:label': false,
    },
  },
  title: {
    'ui:placeholder': 'CEO / Manager / Partner',
  },
  email: {
    'ui:placeholder': 'john@example.com',
  },
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
};
