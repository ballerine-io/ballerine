import { UiSchema } from '@rjsf/utils';

export const bankInformationUISchema: UiSchema = {
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  country: {
    'ui:placeholder': 'United Kingdom',
  },
  bankName: {
    'ui:placeholder': 'Barclays',
  },
  holder: {
    'ui:placeholder': 'OpenAI Technologies, Inc.',
  },
  account: {
    'ui:placeholder': '20456720',
  },
  currency: {
    'ui:placeholder': 'GBP',
  },
};
