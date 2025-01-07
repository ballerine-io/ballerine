import { IFormElement } from '../../types';

export const schema: Array<IFormElement<any, any>> = [
  {
    id: 'first-name',
    element: 'textfield',
    valueDestination: 'firstName',
    params: {
      label: 'First Name',
      placeholder: 'Enter something to reveal some more!',
    },
    validate: [
      {
        type: 'required',
        value: {},
        message: 'First name is required',
        applyWhen: {
          engine: 'json-logic',
          value: {
            '!': { var: 'forceEverythingOptionnal' },
          },
        },
      },
    ],
  },
  {
    id: 'reveal-more',
    element: 'checkboxfield',
    valueDestination: 'revealMore',
    params: {
      label: 'Reveal More',
    },
  },
  {
    id: 'force-everything-optionnal',
    element: 'checkboxfield',
    valueDestination: 'forceEverythingOptionnal',
    params: {
      label: 'Force everything to be optionnal',
    },
  },
  {
    id: 'last-name',
    element: 'textfield',
    valueDestination: 'lastName',
    params: {
      label: 'Last Name',
    },
    hidden: [
      {
        engine: 'json-logic',
        value: {
          and: [{ '!': { var: 'firstName' } }, { '!': { var: 'revealMore' } }],
        },
      },
    ],
    validate: [
      {
        type: 'required',
        value: {},
        message: 'Last name is required',
        applyWhen: {
          engine: 'json-logic',
          value: {
            and: [{ '!!': { var: 'firstName' } }, { '!': { var: 'forceEverythingOptionnal' } }],
          },
        },
      },
    ],
  },
  {
    id: 'submit',
    element: 'submitbutton',
    valueDestination: 'submit',
    params: {
      label: 'Submit',
      disableWhenFormIsInvalid: true,
    },
  },
];
