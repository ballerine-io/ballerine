import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const signupFormSchema: (props: { jobTitle?: boolean }) => RJSFSchema = ({
  jobTitle,
} = {}) => ({
  type: 'object',
  required: ['firstName', 'lastName', 'email'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      maxLength: 50,
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      maxLength: 50,
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
      maxLength: 254,
    },
    additionalInfo: {
      type: 'object',
      default: {},
      required: [...[jobTitle ? 'jobTitle' : null]].filter(Boolean),
      properties: {
        ...(jobTitle
          ? {
              jobTitle: {
                type: 'string',
                title: 'Job Title',
                maxLength: 50,
              },
            }
          : {}),
      },
    },
  },
});

export const signupFormUiSchema: UiSchema = {
  additionalInfo: {
    'ui:label': false,
  },
};
