export const personalInformationSchema = {
  type: 'object',
  title: 'Personal information',
  properties: {
    name: {
      type: 'object',
      title: '',
      properties: {
        firstName: {
          title: 'Name',
          type: 'string',
          minLength: 1,
        },
        lastName: {
          title: '',
          type: 'string',
          minLength: 1,
        },
      },
      required: ['firstName', 'lastName'],
    },
    title: {
      title: 'Title',
      type: 'string',
      minLength: 1,
    },
    birthDate: {
      type: 'string',
      title: 'Date of Birth',
      minLength: 1,
    },
    phoneNumber: {
      type: 'string',
      title: 'Phone Number',
      minLength: 1,
    },
    companyCheck: {
      title: 'dfrd',
      type: 'boolean',
      description: 'I have the signing authority for this company',
      enum: [null, true],
    },
  },
  required: ['name', 'title', 'birthDate', 'phoneNumber'],
};

export const personalInformationUISchema = {
  phoneNumber: {
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
