import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import { ICommonValidator, IValidationError, IValidationSchema } from '../../types';
import { registerValidator } from '../register-validator';
import { validate } from './validate';

describe('validate', () => {
  it('should be defined', () => {
    expect(validate).toBeDefined();
  });

  describe('validation', () => {
    describe('abort early', () => {
      it('should return only first error when abortEarly is true', () => {
        const testValue = {
          name: null,
          age: 25,
        };

        const schema = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [{ type: 'required', message: 'Name is required.', value: {} }],
          },
          {
            id: 'age',
            valueDestination: 'age',
            validators: [
              {
                type: 'maximum',
                message: 'Age must be 20 or less',
                value: { maximum: 20 },
              },
            ],
          },
        ] as IValidationSchema[];

        const errors = validate(testValue, schema, { abortEarly: true });

        expect(errors.length).toBe(1);
        expect(errors?.[0]?.message).toEqual(['Name is required.']);
      });

      it('should return all errors when abortEarly is false', () => {
        const testValue = {
          name: null,
          age: 25,
        };

        const schema = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [{ type: 'required', message: 'Name is required.', value: {} }],
          },
          {
            id: 'age',
            valueDestination: 'age',
            validators: [
              {
                type: 'maximum',
                message: 'Age must be 20 or less',
                value: { maximum: 20 },
              },
            ],
          },
        ] as IValidationSchema[];

        const errors = validate(testValue, schema, { abortEarly: false });

        expect(errors.length).toBe(2);
        expect(errors?.[0]?.message).toEqual(['Name is required.']);
        expect(errors?.[1]?.message).toEqual(['Age must be 20 or less']);
      });
    });

    describe('abort at first error', () => {
      it('should return only first error for each field when abortAtFirstError is true', () => {
        const testValue = {
          name: null,
          age: 25,
        };

        const schema = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [
              { type: 'required', message: 'Name is required.', value: {} },
              {
                type: 'minLength',
                message: 'Name must be at least 2 chars',
                value: { minLength: 2 },
              },
            ],
          },
          {
            id: 'age',
            valueDestination: 'age',
            validators: [
              {
                type: 'maximum',
                message: 'Age must be 20 or less',
                value: { maximum: 20 },
              },
              {
                type: 'minimum',
                message: 'Age must be at least 18',
                value: { minimum: 18 },
              },
            ],
          },
        ] as IValidationSchema[];

        const errors = validate(testValue, schema, { abortAfterFirstError: true });

        expect(errors.length).toBe(2);
        expect(errors?.[0]?.message).toEqual(['Name is required.']);
        expect(errors?.[1]?.message).toEqual(['Age must be 20 or less']);
      });

      it('should return all errors for each field when abortAtFirstError is false', () => {
        const testValue = {
          name: '',
          age: 25,
        };

        const schema = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [
              { type: 'required', message: 'Name is required.', value: {} },
              {
                type: 'minLength',
                message: 'Name must be at least 2 chars',
                value: { minLength: 2 },
              },
            ],
          },
          {
            id: 'age',
            valueDestination: 'age',
            validators: [
              {
                type: 'maximum',
                message: 'Age must be 20 or less',
                value: { maximum: 20 },
              },
              {
                type: 'minimum',
                message: 'Age must be at least 18',
                value: { minimum: 18 },
              },
            ],
          },
        ] as IValidationSchema[];

        const errors = validate(testValue, schema, { abortAfterFirstError: false });

        expect(errors.length).toBe(3);
        expect(errors?.[0]?.message).toEqual(['Name is required.']);
        expect(errors?.[1]?.message).toEqual(['Name must be at least 2 chars']);
        expect(errors?.[2]?.message).toEqual(['Age must be 20 or less']);
      });
    });

    describe('plain objects', () => {
      describe('will be valid', () => {
        const requiredCase = [
          {
            name: 'John',
          },
          [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [{ type: 'required', message: 'Field is required.', value: {} }],
            },
          ] as IValidationSchema[],
        ] as const;

        const maximumValueCase = [
          {
            age: 20,
          },
          [
            {
              id: 'age',
              valueDestination: 'age',
              validators: [
                {
                  type: 'maximum',
                  message: 'Maximum value is {maximum}',
                  value: {
                    maximum: 20,
                  },
                },
              ],
            },
          ] as IValidationSchema[],
        ] as const;

        const minimumValueCase = [
          {
            age: 20,
          },
          [
            {
              id: 'age',
              valueDestination: 'age',
              validators: [
                {
                  type: 'minimum',
                  message: 'Minimum value is {minimum}',
                  value: {
                    minimum: 20,
                  },
                },
              ],
            },
          ] as IValidationSchema[],
        ] as const;

        const maxLengthStringCase = [
          {
            name: 'John',
          },
          [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [
                { type: 'maxLength', message: 'Field is invalid.', value: { maxLength: 4 } },
              ],
            },
          ] as IValidationSchema[],
        ] as const;

        const maxLengthArrayCase = [
          {
            list: [1, 2, 3, 4],
          },
          [
            {
              id: 'list',
              valueDestination: 'list',
              validators: [
                { type: 'maxLength', message: 'Field is invalid.', value: { maxLength: 4 } },
              ],
            },
          ] as IValidationSchema[],
        ] as const;

        const minLengthArrayCase = [
          {
            list: [1, 2, 3, 4],
          },
          [
            {
              id: 'list',
              valueDestination: 'list',
              validators: [
                { type: 'minLength', message: 'Field is invalid.', value: { minLength: 4 } },
              ],
            },
          ] as IValidationSchema[],
        ] as const;

        const minLengthStringCase = [
          {
            name: 'John',
          },
          [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [
                { type: 'minLength', message: 'Field is invalid.', value: { minLength: 4 } },
              ],
            },
          ] as IValidationSchema[],
        ] as const;

        const patternStringCase = [
          {
            name: 'John',
          },
          [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [
                { type: 'pattern', message: 'Field is invalid.', value: { pattern: /[A-Z]/ } },
              ],
            },
          ] as IValidationSchema[],
        ] as const;

        const cases = [
          requiredCase,
          maximumValueCase,
          minimumValueCase,
          maxLengthStringCase,
          maxLengthArrayCase,
          minLengthArrayCase,
          minLengthStringCase,
          patternStringCase,
        ];

        test.each(cases)('is valid', (testData, schema) => {
          const errors = validate(testData, schema);

          expect(errors).toEqual([]);
        });
      });

      describe('will be invalid', () => {
        const requiredCase = [
          {
            name: null,
          },
          [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [{ type: 'required', message: 'Field is required.', value: {} }],
            },
          ] as IValidationSchema[],
          ['Field is required.'],
        ] as const;

        const maximumValueCase = [
          {
            age: 25,
          },
          [
            {
              id: 'age',
              valueDestination: 'age',
              validators: [
                {
                  type: 'maximum',
                  message: 'Maximum value is {maximum}',
                  value: {
                    maximum: 20,
                  },
                },
              ],
            },
          ] as IValidationSchema[],
          ['Maximum value is 20'],
        ] as const;

        const minimumValueCase = [
          {
            age: 15,
          },
          [
            {
              id: 'age',
              valueDestination: 'age',
              validators: [
                {
                  type: 'minimum',
                  message: 'Minimum value is {minimum}',
                  value: {
                    minimum: 20,
                  },
                },
              ],
            },
          ] as IValidationSchema[],
          ['Minimum value is 20'],
        ] as const;

        const maxLengthStringCase = [
          {
            name: 'John Doe',
          },
          [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [
                { type: 'maxLength', message: 'Field is invalid.', value: { maxLength: 4 } },
              ],
            },
          ] as IValidationSchema[],
          ['Field is invalid.'],
        ] as const;

        const maxLengthArrayCase = [
          {
            list: [1, 2, 3, 4, 5],
          },
          [
            {
              id: 'list',
              valueDestination: 'list',
              validators: [
                { type: 'maxLength', message: 'Field is invalid.', value: { maxLength: 4 } },
              ],
            },
          ] as IValidationSchema[],
          ['Field is invalid.'],
        ] as const;

        const minLengthArrayCase = [
          {
            list: [1, 2, 3],
          },
          [
            {
              id: 'list',
              valueDestination: 'list',
              validators: [
                { type: 'minLength', message: 'Field is invalid.', value: { minLength: 4 } },
              ],
            },
          ] as IValidationSchema[],
          ['Field is invalid.'],
        ] as const;

        const minLengthStringCase = [
          {
            name: 'Doe',
          },
          [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [
                { type: 'minLength', message: 'Field is invalid.', value: { minLength: 4 } },
              ],
            },
          ] as IValidationSchema[],
          ['Field is invalid.'],
        ] as const;

        const patternStringCase = [
          {
            name: '1',
          },
          [
            {
              id: 'name',
              valueDestination: 'name',
              validators: [
                { type: 'pattern', message: 'Field is invalid.', value: { pattern: /[A-Z]/ } },
              ],
            },
          ] as IValidationSchema[],
          ['Field is invalid.'],
        ] as const;

        const cases = [
          requiredCase,
          maximumValueCase,
          minimumValueCase,
          maxLengthStringCase,
          maxLengthArrayCase,
          minLengthArrayCase,
          minLengthStringCase,
          patternStringCase,
        ];

        test.each(cases)('validation will fail', (testData, schema, expectedErrors) => {
          const errors = validate(testData, schema);
          const error = errors[0];

          expect(errors.length).toEqual(1);
          expect(error?.message[0]).toEqual(expectedErrors[0]);
        });
      });
    });

    describe('nested objects', () => {
      it('will be valid', () => {
        const testValue = {
          name: 'John',
          tasks: [
            {
              name: 'Jane',
            },
            {
              name: 'Jim',
              siblings: [
                {
                  name: 'Jill',
                },
              ],
            },
          ],
        };

        const schema = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [{ type: 'required', message: 'Field is required.', value: {} }],
          },
          {
            id: 'tasks',
            valueDestination: 'tasks',
            validators: [
              {
                type: 'minLength',
                message: 'Field is invalid.',
                value: { minLength: 2 },
              },
            ],
            children: [
              {
                id: 'tasksName',
                valueDestination: 'tasks[$0].name',
                validators: [{ type: 'required', message: 'Field is required.', value: {} }],
              },
              {
                id: 'siblings',
                valueDestination: 'tasks[$0].siblings',
                children: [
                  {
                    id: 'siblingsName',
                    valueDestination: 'tasks[$0].siblings[$1].name',
                    validators: [{ type: 'required', message: 'Field is required.', value: {} }],
                  },
                ],
              },
            ],
          },
        ] as IValidationSchema[];

        expect(validate(testValue, schema)).toEqual([]);
      });

      it('will be invalid', () => {
        const testValue = {
          name: 'John',
          tasks: [
            {
              name: 'Jane',
            },
            {
              name: 'Jim',
              siblings: [
                {
                  name: 'Jill',
                },
              ],
            },
          ],
        };

        const schema = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [{ type: 'required', message: 'Field is required.', value: {} }],
          },
          {
            id: 'tasks',
            valueDestination: 'tasks',
            validators: [
              {
                type: 'minLength',
                message: 'Field is invalid.',
                value: { minLength: 2 },
              },
            ],
            children: [
              {
                id: 'tasksName',
                valueDestination: 'tasks[$0].name',
                validators: [{ type: 'required', message: 'Field is required.', value: {} }],
              },
              {
                id: 'siblings',
                valueDestination: 'tasks[$0].siblings',
                children: [
                  {
                    id: 'siblingsName',
                    valueDestination: 'tasks[$0].siblings[$1].name',
                    validators: [{ type: 'required', message: 'Field is required.', value: {} }],
                  },
                ],
              },
            ],
          },
        ] as IValidationSchema[];

        expect(validate(testValue, schema)).toEqual([]);
      });
    });

    describe('when validating array entries as root', () => {
      it('will be valid', () => {
        const value = [
          {
            name: 'John Doe',
          },
        ];

        const schema = [
          {
            id: 'list',
            children: [
              {
                id: 'name',
                valueDestination: '[$0].name',
                validators: [{ type: 'required', message: 'Field is required.', value: {} }],
              },
            ],
          },
        ] as IValidationSchema[];

        expect(validate(value, schema)).toEqual([]);
      });

      it('will be invalid', () => {
        const value = [
          {
            name: null,
          },
        ];

        const schema = [
          {
            id: 'list',
            children: [
              {
                id: 'name',
                valueDestination: '[$0].name',
                validators: [{ type: 'required', message: 'Field is required.', value: {} }],
              },
            ],
          },
        ] as IValidationSchema[];

        const errors = validate(value, schema);

        expect(errors.length).toBe(1);
        expect(errors[0]?.message[0]).toEqual('Field is required.');
      });
    });

    describe('validation errors', () => {
      it('should be returned as array', () => {
        const testValue = {
          name: null,
        };

        const schema = [
          {
            id: 'name',
            valueDestination: 'name',
            validators: [{ type: 'required', message: 'Field is required.', value: {} }],
          },
        ] as IValidationSchema[];

        expect(validate(testValue, schema)).toEqual([
          {
            id: 'name',
            originId: 'name',
            invalidValue: null,
            message: ['Field is required.'],
          },
        ]);
      });

      describe('with formattedId', () => {
        const oneLevelDepthCase = [
          {
            items: [
              {
                name: null,
              },
            ],
          },
          [
            {
              id: 'items',
              valueDestination: 'items',
              children: [
                {
                  id: 'name',
                  valueDestination: 'items[$0].name',
                  validators: [{ type: 'required', message: 'Field is required.', value: {} }],
                },
              ],
            },
          ] as IValidationSchema[],
          {
            id: 'name-0',
            originId: 'name',
            invalidValue: null,
            message: ['Field is required.'],
          } as IValidationError,
        ] as const;

        const twoLevelDepthCase = [
          {
            items: [
              {
                name: null,
                subItems: [
                  {
                    subName: null,
                  },
                ],
              },
            ],
          },
          [
            {
              id: 'items',
              valueDestination: 'items',
              children: [
                {
                  id: 'name',
                  valueDestination: 'items[$0].subItems',
                  children: [
                    {
                      id: 'subName',
                      valueDestination: 'items[$0].subItems[$1].subName',
                      validators: [{ type: 'required', message: 'Field is required.', value: {} }],
                    },
                  ],
                },
              ],
            },
          ] as IValidationSchema[],
          {
            id: 'subName-0-0',
            originId: 'subName',
            invalidValue: null,
            message: ['Field is required.'],
          } as IValidationError,
        ] as const;

        test.each([oneLevelDepthCase, twoLevelDepthCase])(
          'should return errors with formattedId',
          (testData, schema, expectedErrors) => {
            const errors = validate(testData, schema);
            const error = errors[0];

            expect(errors?.length).toBe(1);
            expect(error).toEqual(expectedErrors);
          },
        );
      });

      describe('nested arrays with multiple items', () => {
        it('will be valid', () => {
          const value = {
            items: [
              {
                name: null,
                subItems: [
                  {
                    subName: null,
                  },
                  {
                    subName: null,
                  },
                ],
              },
              {
                subItems: [
                  {
                    subName: null,
                  },
                ],
              },
            ],
          };

          const schema = [
            {
              id: 'items',
              valueDestination: 'items',
              children: [
                {
                  id: 'name',
                  valueDestination: 'items[$0].subItems',
                  children: [
                    {
                      id: 'subName',
                      valueDestination: 'items[$0].subItems[$1].subName',
                      validators: [{ type: 'required', message: 'Field is required.', value: {} }],
                    },
                  ],
                },
              ],
            },
          ] as IValidationSchema[];

          expect(validate(value, schema)).toEqual([
            {
              id: 'subName-0-0',
              originId: 'subName',
              invalidValue: null,
              message: ['Field is required.'],
            },
            {
              id: 'subName-0-1',
              originId: 'subName',
              invalidValue: null,
              message: ['Field is required.'],
            },
            {
              id: 'subName-1-0',
              originId: 'subName',
              invalidValue: null,
              message: ['Field is required.'],
            },
          ]);
        });
      });
    });

    describe('conditional validation', () => {
      const case1 = [
        {
          firstName: 'John',
          lastName: undefined,
        },
        [
          {
            id: 'name',
            valueDestination: 'firstName',
            validators: [{ type: 'required', message: 'Field is required.', value: {} }],
          },
          {
            id: 'lastName',
            valueDestination: 'lastName',
            validators: [
              {
                type: 'required',
                message: 'Field is required.',
                value: {},
                applyWhen: {
                  engine: 'json-logic',
                  value: {
                    var: 'firstName',
                  },
                },
              },
            ],
          },
        ] as IValidationSchema[],
        {
          id: 'lastName',
          originId: 'lastName',
          invalidValue: undefined,
          message: ['Field is required.'],
        } as IValidationError,
      ] as const;

      const case2 = [
        {
          firstName: 'Banana',
          lastName: undefined,
        },
        [
          {
            id: 'lastName',
            valueDestination: 'lastName',
            validators: [
              {
                type: 'required',
                message: 'Field is required.',
                value: {},
                applyWhen: {
                  engine: 'json-logic',
                  value: {
                    '==': [{ var: 'firstName' }, 'Banana'],
                  },
                },
              },
            ],
          },
        ] as IValidationSchema[],
        {
          id: 'lastName',
          originId: 'lastName',
          invalidValue: undefined,
          message: ['Field is required.'],
        } as IValidationError,
      ] as const;

      const cases = [case1, case2];

      test.each(cases)(
        'should be applied when the condition is truthy',
        (testData, schema, expectedErrors) => {
          const errors = validate(testData, schema);

          expect(errors).toEqual([expectedErrors]);
        },
      );
    });

    describe('custom validators', () => {
      beforeEach(() => {
        vi.clearAllMocks();
      });

      it('even number validator', () => {
        const evenNumberValidator = (value: number, _: ICommonValidator) => {
          if (typeof value !== 'number') {
            return true;
          }

          if (value % 2 !== 0) {
            throw new Error('Number is not even');
          }
        };

        registerValidator('evenNumber', evenNumberValidator);

        const data = {
          odd: 19,
          even: 20,
        };

        const schema = [
          {
            id: 'odd',
            valueDestination: 'odd',
            validators: [{ type: 'evenNumber', value: {} }],
          },
          {
            id: 'even',
            valueDestination: 'even',
            validators: [{ type: 'evenNumber', value: {} }],
          },
        ] as Array<IValidationSchema<'evenNumber'>>;

        const errors = validate(data, schema);

        expect(errors).toEqual([
          {
            id: 'odd',
            originId: 'odd',
            invalidValue: 19,
            message: ['Number is not even'],
          },
        ]);
      });
    });

    describe('global validation rules', () => {
      it('should be applied to all validators', () => {
        const schema = [
          {
            id: 'value',
            valueDestination: 'value',
            validators: [],
          },
        ] as IValidationSchema[];

        const globalValidationRules = [
          { type: 'required', message: 'Field is required.', value: {} },
        ] as Array<ICommonValidator<any, any>>;

        const data = {};

        expect(validate(data, schema, {}, globalValidationRules)).toEqual([
          {
            id: 'value',
            originId: 'value',
            invalidValue: undefined,
            message: ['Field is required.'],
          },
        ]);
      });

      it('should be applied conditionally', () => {
        const schema = [
          {
            id: 'value',
            valueDestination: 'value',
            validators: [],
          },
        ] as IValidationSchema[];

        const globalValidationRules = [
          {
            type: 'required',
            message: 'Field is required.',
            value: {},
            applyWhen: {
              engine: 'json-logic',
              value: {
                '==': [{ var: 'number' }, 1],
              },
            },
          },
        ] as Array<ICommonValidator<any, any>>;

        const data = {
          number: 1,
        };

        expect(validate(data, schema, {}, globalValidationRules)).toEqual([
          {
            id: 'value',
            originId: 'value',
            invalidValue: undefined,
            message: ['Field is required.'],
          },
        ]);

        data.number = 2;

        expect(validate(data, schema, {}, globalValidationRules)).toEqual([]);
      });
    });
  });
});
