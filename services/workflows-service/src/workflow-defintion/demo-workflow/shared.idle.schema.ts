import { Type } from '@sinclair/typebox';

const sharedEntityUISchema = {
  entity: {
    'ui:label': false,
    id: {
      'ui:title': 'Entity ID (As represented in your system)',
    },
    type: {
      hidden: true,
    },
    data: {
      'ui:label': false,
      companyName: {
        'ui:title': 'Company Name',
      },
      additionalInfo: {
        'ui:label': false,
        mainRepresentative: {
          'ui:label': false,
          'ui:order': ['email', 'firstName', 'lastName'],
          email: {
            'ui:title': 'Email',
          },
          firstName: {
            'ui:title': 'First Name',
          },
          lastName: {
            'ui:title': 'Last Name',
          },
        },
      },
    },
  },
};

export const sharedEntitySchema = Type.Object({
  entity: Type.Object({
    id: Type.String(),
    type: Type.String({ default: 'business' }),
    data: Type.Object({
      companyName: Type.String(),
      additionalInfo: Type.Object({
        mainRepresentative: Type.Object({
          firstName: Type.String(),
          lastName: Type.String(),
          email: Type.String({ format: 'email' }),
        }),
      }),
    }),
  }),
});

export const sharedInputSchema = {
  dataSchema: sharedEntitySchema,
  uiSchema: sharedEntityUISchema,
};
