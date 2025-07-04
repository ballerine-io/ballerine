import { TUIElement } from '@ballerine/common';

export const schema: Array<TUIElement> = [
  {
    id: 'first-name-field',
    element: 'textfield',
    valueDestination: 'firstName',
    params: {
      label: 'First Name',
      placeholder: 'Enter your first name',
    },
    validate: [
      {
        type: 'required',
        message: 'First name is required',
      },
    ],
  },
  {
    id: 'last-name-field',
    element: 'textfield',
    valueDestination: 'lastName',
    params: {
      label: 'Last Name',
      placeholder: 'Enter your last name',
    },
    validate: [
      {
        type: 'required',
        message: 'Last name is required',
      },
    ],
  },
  {
    id: 'date-of-birth-field',
    element: 'datefield',
    valueDestination: 'dateOfBirth',
    params: {
      label: 'Date of Birth',
      placeholder: 'Enter your date of birth',
    },
    validate: [
      {
        type: 'required',
        message: 'Date of birth is required',
      },
    ],
  },
  {
    id: 'passport-photo',
    element: 'filefield',
    valueDestination: 'passportPhoto',
    params: {
      label: 'Passport Photo',
      placeholder: 'Select your passport photo',
      httpParams: {
        createDocument: {
          params: {},
          url: '',
          method: 'GET',
          resultPath: '',
          headers: {},
        },
        deleteDocument: {
          params: {},
          url: '',
          method: 'GET',
          resultPath: '',
          headers: {},
        },
      },
    },
    validate: [
      {
        type: 'required',
        message: 'Passport photo is required',
        applyWhen: {
          engine: 'json-logic',
          value: {
            '!': { var: 'iDontHaveDocument' },
          },
        },
      },
    ],
  },
  {
    id: 'idont-have-document-checkbox',
    element: 'checkboxfield',
    valueDestination: 'iDontHaveDocument',
    params: {
      label: "I don't have a document",
    },
  },
  {
    id: 'workplaces',
    valueDestination: 'workplaces',
    element: 'fieldlist',
    params: {
      label: 'Workplaces',
      addButtonLabel: 'Add Workplace',
    },
    validate: [
      { type: 'required', message: 'Workplaces are required' },
      {
        type: 'minLength',
        value: { minLength: 2 },
        message: 'At least {minLength} workplaces are required',
      },
    ],
    children: [
      {
        id: 'workplace-name',
        element: 'textfield',
        valueDestination: 'workplaces[$0].workplaceName',
        params: {
          label: 'Workplace Name',
        },
        validate: [{ type: 'required', message: 'Workplace name is required' }],
      },
      {
        id: 'workplace-start-date',
        element: 'datefield',
        valueDestination: 'workplaces[$0].workplaceStartDate',
        params: {
          label: 'Workplace Start Date',
        },
        validate: [{ type: 'required', message: 'Workplace start date is required' }],
      },
      {
        id: 'certificate-of-employment',
        element: 'filefield',
        valueDestination: 'workplaces[$0].certificateOfEmployment',
        params: {
          label: 'Certificate of Employment',
          httpParams: {
            createDocument: {
              params: {},
              url: '',
              method: 'GET',
              resultPath: '',
              headers: {},
            },
            deleteDocument: {
              params: {},
              url: '',
              method: 'GET',
              resultPath: '',
              headers: {},
            },
          },
        },
        validate: [],
      },
    ],
  },
  {
    id: 'submit-button',
    element: 'submitbutton',
    valueDestination: 'submit',
    params: {
      text: 'Submit',
    },
  },
];
