import { IFormElement } from '../../types';

export const schema: Array<IFormElement<any, any>> = [
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
        value: {},
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
        value: {},
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
        value: {},
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
    },
    validate: [
      {
        type: 'required',
        value: {},
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
      { type: 'required', value: {}, message: 'Workplaces are required' },
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
        validate: [{ type: 'required', value: {}, message: 'Workplace name is required' }],
      },
      {
        id: 'workplace-start-date',
        element: 'datefield',
        valueDestination: 'workplaces[$0].workplaceStartDate',
        params: {
          label: 'Workplace Start Date',
        },
        validate: [{ type: 'required', value: {}, message: 'Workplace start date is required' }],
      },
      {
        id: 'certificate-of-employment',
        element: 'filefield',
        valueDestination: 'workplaces[$0].certificateOfEmployment',
        params: {
          label: 'Certificate of Employment',
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
      label: 'Submit',
    },
  },
];
