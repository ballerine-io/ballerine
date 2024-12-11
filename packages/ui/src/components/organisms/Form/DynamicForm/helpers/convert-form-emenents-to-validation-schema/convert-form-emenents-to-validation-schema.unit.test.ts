import { describe, expect, test } from 'vitest';
import { IValidationSchema } from '../../../Validator';
import { IFormElement } from '../../types';
import { convertFormElementsToValidationSchema } from './convert-form-emenents-to-validation-schema';

describe('convertFormElementsToValidationSchema', () => {
  const case1 = [
    [{ id: '1', valueDestination: 'test', validate: [], element: 'textinput' }] as IFormElement[],
    [
      { id: '1', valueDestination: 'test', validators: [], children: undefined },
    ] as IValidationSchema[],
  ] as const;

  const case2 = [
    [
      {
        id: 'fieldlist',
        valueDestination: 'test',
        validate: [
          {
            type: 'required',
          },
        ],
        element: 'fieldlist',
        children: [
          {
            id: 'textinput',
            valueDestination: 'test',
            element: 'textinput',
            validate: [
              {
                type: 'required',
              },
            ],
          },
          {
            id: 'nested-fieldlist',
            valueDestination: 'test',
            element: 'fieldlist',
            validate: [{ type: 'required' }],
            children: [
              {
                id: 'nested-textinput',
                valueDestination: 'test',
                element: 'textinput',
                validate: [
                  {
                    type: 'required',
                  },
                ],
              },
            ],
          },
        ],
      },
    ] as IFormElement[],
    [
      {
        id: 'fieldlist',
        valueDestination: 'test',
        validators: [{ type: 'required' }],
        children: [
          { id: 'textinput', valueDestination: 'test', validators: [{ type: 'required' }] },
          {
            id: 'nested-fieldlist',
            valueDestination: 'test',
            validators: [{ type: 'required' }],
            children: [
              {
                id: 'nested-textinput',
                valueDestination: 'test',
                validators: [{ type: 'required' }],
              },
            ],
          },
        ],
      },
    ],
  ] as const;

  const cases = [case1, case2];

  test.each(cases)('should convert form elements to validation schema', (schema, output) => {
    const validationSchema = convertFormElementsToValidationSchema(schema);
    expect(validationSchema).toEqual(output);
  });
});
