import { describe, expect, it } from 'vitest';
import { IFormElement } from '../../../../types';
import { insertDefaultValues } from './insert-default-values';

describe('insertDefaultValues', () => {
  it('should insert default values', () => {
    const values = {};
    const schema = [
      {
        id: '1',
        valueDestination: 'firstName',
        defaultValue: 'John',
      },
      {
        id: '2',
        valueDestination: 'lastName',
        defaultValue: 'Doe',
      },
      {
        id: 'subitems',
        children: [
          {
            id: 'age',
            valueDestination: 'age',
            defaultValue: 20,
          },
          {
            id: 'fieldlist',
            valueDestination: 'fieldlist',
            defaultValue: [
              {
                val: 'Hello World',
              },
              {
                val: 'Hello World 2',
              },
            ],
            children: [
              {
                id: 'fieldlistItem',
                valueDestination: 'fieldlistItem[$0].val',
              },
            ],
          },
        ],
      },
    ] as Array<IFormElement<string, any>>;

    const result = insertDefaultValues(values, schema);

    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      age: 20,
      fieldlist: [
        {
          val: 'Hello World',
        },
        {
          val: 'Hello World 2',
        },
      ],
    });
  });

  it('should not override existing values with default values', () => {
    const values = {
      firstName: 'John',
    };

    const schema = [
      {
        id: '1',
        valueDestination: 'firstName',
        defaultValue: 'Doe',
      },
    ] as Array<IFormElement<string, any>>;

    const result = insertDefaultValues(values, schema);

    expect(result).toEqual({
      firstName: 'John',
    });
  });

  it('should not modify values if schema is not provided', () => {
    const values = {};
    const result = insertDefaultValues(values, undefined);

    expect(result).toBe(values);
  });
});
