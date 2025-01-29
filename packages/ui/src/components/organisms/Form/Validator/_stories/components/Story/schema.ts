import { IValidationSchema } from '../../../types';

export const initialSchema: IValidationSchema[] = [
  {
    id: 'firstname-field',
    valueDestination: 'firstName',
    validators: [
      {
        type: 'required',
        message: 'Name is required',
        value: {},
      },
      {
        type: 'minLength',
        value: { minLength: 1 },
        message: 'Name must be at least {minLength} characters long',
      },
      {
        type: 'maxLength',
        value: { maxLength: 10 },
        message: 'Name must be at most {maxLength} characters long',
      },
    ],
  },
  {
    id: 'lastname-field',
    valueDestination: 'lastName',
    validators: [
      {
        type: 'required',
        message: 'Last name is required',
        value: {},
      },
    ],
  },
  {
    id: 'age-field',
    valueDestination: 'age',
    validators: [
      {
        type: 'required',
        message: 'Age is required',
        value: {},
        applyWhen: {
          engine: 'json-logic',
          value: {
            and: [{ '!!': { var: 'firstName' } }, { '!!': { var: 'lastName' } }],
          },
        },
      },
      {
        type: 'minimum',
        value: { minimum: 18 },
        message: 'You must be at least {minimum} years old',
      },
      {
        type: 'maximum',
        value: { maximum: 65 },
        message: 'You must be at most {maximum} years old',
      },
    ],
  },
  {
    id: 'list-field',
    valueDestination: 'list',
    validators: [
      {
        type: 'required',
        message: 'List is required',
        value: {},
      },
      {
        type: 'minLength',
        value: { minLength: 1 },
        message: 'List must be at least {minLength} items long',
      },
    ],
    children: [
      {
        id: 'list-item',
        valueDestination: 'list[$0]',
        validators: [
          {
            type: 'maxLength',
            message: 'Item must be at most {maxLength} characters long',
            value: { maxLength: 5 },
          },
        ],
      },
    ],
  },
  {
    id: 'nested-list',
    valueDestination: 'nestedList',
    validators: [
      {
        type: 'required',
        value: {},
        message: 'Nested list is required',
      },
    ],
    children: [
      {
        id: 'nested-list-item-value',
        valueDestination: 'nestedList[$0].value',
        validators: [
          {
            type: 'required',
            value: {},
            message: 'Nested list item value is required',
          },
        ],
      },
      {
        id: 'nested-list-item-sublist',
        valueDestination: 'nestedList[$0].sublist',
        validators: [],
        children: [
          {
            id: 'nested-list-subitem',
            valueDestination: 'nestedList[$0].sublist[$1].value',
            validators: [
              {
                type: 'maxLength',
                value: { maxLength: 10 },
                message: 'Subitem must be at most {maxLength} characters long',
              },
            ],
          },
        ],
      },
    ],
  },
];
