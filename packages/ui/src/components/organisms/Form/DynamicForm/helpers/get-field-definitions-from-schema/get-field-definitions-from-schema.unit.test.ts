import { describe, expect, it } from 'vitest';
import { getFieldDefinitionsFromSchema } from './get-field-definitions-from-schema';
import { TUIElement } from '@ballerine/common';

describe('getFieldDefinitionsFromSchema', () => {
  it('should return empty array when no elements provided', () => {
    const result = getFieldDefinitionsFromSchema([]);
    expect(result).toEqual([]);
  });

  it('should filter out elements without valueDestination and no children', () => {
    const elements = [
      { id: '1', element: 'textfield' },
      { id: '2', valueDestination: 'test', element: 'textfield' },
    ] as Array<TUIElement>;

    const result = getFieldDefinitionsFromSchema(elements);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('2');
  });

  it('should include elements with valueDestination', () => {
    const elements: Array<TUIElement> = [
      { id: '1', valueDestination: 'test1', element: 'textfield' },
      { id: '2', valueDestination: 'test2', element: 'textfield' },
    ] as Array<TUIElement>;

    const result = getFieldDefinitionsFromSchema(elements);
    expect(result).toHaveLength(2);
    expect(result[0]?.valueDestination).toBe('test1');
    expect(result[1]?.valueDestination).toBe('test2');
  });

  it('should process nested children correctly', () => {
    const elements: Array<TUIElement> = [
      {
        id: '1',
        valueDestination: 'parent',
        element: 'column',
        params: {},
        children: [
          { id: '1.1', valueDestination: 'child1', element: 'textfield', params: {} },
          { id: '1.2', valueDestination: 'child2', element: 'textfield', params: {} },
        ],
      },
    ];

    const result = getFieldDefinitionsFromSchema(elements);
    expect(result).toHaveLength(1);
    expect(result[0]?.children).toHaveLength(2);
    expect(result[0]?.children?.[0]?.valueDestination).toBe('child1');
    expect(result[0]?.children?.[1]?.valueDestination).toBe('child2');
  });

  it('should process elements with children but no valueDestination', () => {
    const elements = [
      {
        id: '1',
        element: 'column',
        params: {},
        children: [
          { id: '1.1', valueDestination: 'child1', element: 'textfield', params: {} },
          { id: '1.2', valueDestination: 'child2', element: 'textfield', params: {} },
        ],
      },
    ] as Array<TUIElement>;

    const result = getFieldDefinitionsFromSchema(elements);
    expect(result).toHaveLength(2);
    expect(result[0]?.valueDestination).toBe('child1');
    expect(result[1]?.valueDestination).toBe('child2');
  });

  it('should handle deeply nested structures', () => {
    const elements: Array<TUIElement> = [
      {
        id: '1',
        valueDestination: 'level1',
        element: 'column',
        params: {},
        children: [
          {
            id: '1.1',
            valueDestination: 'level2',
            element: 'column',
            params: {},
            children: [
              { id: '1.1.1', valueDestination: 'level3', element: 'textfield', params: {} },
            ],
          },
        ],
      },
    ];

    const result = getFieldDefinitionsFromSchema(elements);
    expect(result).toHaveLength(1);
    expect(result[0]?.valueDestination).toBe('level1');
    expect(result[0]?.children?.[0]?.valueDestination).toBe('level2');
    expect(result[0]?.children?.[0]?.children?.[0]?.valueDestination).toBe('level3');
  });
});
