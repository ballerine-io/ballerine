import { UiSchema } from '@rjsf/utils';

export const companyActivityUISchema: UiSchema = {
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  industry: {
    'ui:placeholder': 'Food & Beverages',
  },
  model: {
    'ui:placeholder':
      'Please provide as much Information as possible about your products or services.',
    'ui:widget': 'textarea',
  },
  website: {
    'ui:placeholder': 'www.example.co.uk',
  },
  volumeAmount: {
    'ui:placeholder': '$500,000',
  },
  transactionValue: {
    'ui:placeholder': '$10',
  },
};
