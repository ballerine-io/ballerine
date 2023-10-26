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
    personalPhoneNumber: {
      type: 'string',
      title: 'Phone Number',
      minLength: 1,
    },
    companyCheck: {
      title: 'I have the signing authority for this company',
      type: 'boolean',
    },
  },
  required: ['name', 'title', 'birthDate'],
};

export const personalInformationUISchema = {
  'ui:order': ['name', 'title', 'birthDate', 'personalPhoneNumber', 'companyCheck'],
  personalPhoneNumber: {
    'ui:field': 'PhoneInput',
    'ui:label': true,
  },
  birthDate: {
    'ui:field': 'DateInput',
    'ui:label': true,
  },
  name: {
    'ui:order': ['firstName', 'lastName'],
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

export const defaultPersonalInformationData = {
  title: '',
  name: {
    firstName: '',
    lastName: '',
  },
  birthDate: '',
  phoneNumber: '',
  companyCheck: false,
};
