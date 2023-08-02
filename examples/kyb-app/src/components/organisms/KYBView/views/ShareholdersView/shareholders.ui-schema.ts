import { UiSchema } from '@rjsf/utils';

export const shareholdersUISchema: UiSchema = {
  shareholders: {
    items: {
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
