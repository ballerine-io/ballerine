import { UiSchema } from '@rjsf/utils';

export const shareholdersUISchema: UiSchema = {
  'ui:options': {
    submitButtonOptions: {
      submitText: 'Continue',
    },
  },
  shareholders: {
    addText: 'Add Shareholder',
    deleteButtonClassname: 'leading-9',
    items: {
      titleClassName: 'text-sm',
      name: {
        firstName: {
          'ui:placeholder': 'First name',
        },
        lastName: {
          'ui:label': false,
          'ui:placeholder': 'Last name',
        },
      },
      title: {
        'ui:placeholder': 'CEO / Manager / Partner',
      },
      birthDate: {
        'ui:field': 'DateInput',
        'ui:label': true,
      },
      email: {
        'ui:placeholder': 'john@example.com',
      },
    },
  },
};
