import { describe, expect, it } from 'vitest';
import { IFormElement } from '../../types';
import { getFieldDefinitionsFromSchema } from './get-field-definitions-from-schema';

describe('getFieldDefinitionsFromSchema', () => {
  it('should return empty array when no elements provided', () => {
    const result = getFieldDefinitionsFromSchema([]);
    expect(result).toEqual([]);
  });

  it('should filter out elements without valueDestination and no children', () => {
    const elements = [
      { id: '1', element: 'test' },
      { id: '2', valueDestination: 'test', element: 'test' },
    ] as Array<IFormElement<any>>;

    const result = getFieldDefinitionsFromSchema(elements);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('2');
  });

  it('should include elements with valueDestination', () => {
    const elements: Array<IFormElement<any>> = [
      { id: '1', valueDestination: 'test1', element: 'test' },
      { id: '2', valueDestination: 'test2', element: 'test' },
    ] as Array<IFormElement<any>>;

    const result = getFieldDefinitionsFromSchema(elements);
    expect(result).toHaveLength(2);
    expect(result[0]?.valueDestination).toBe('test1');
    expect(result[1]?.valueDestination).toBe('test2');
  });

  it('should process nested children correctly', () => {
    const elements: Array<IFormElement<any>> = [
      {
        id: '1',
        valueDestination: 'parent',
        element: 'test',
        children: [
          { id: '1.1', valueDestination: 'child1', element: 'test' },
          { id: '1.2', valueDestination: 'child2', element: 'test' },
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
        element: 'test',
        children: [
          { id: '1.1', valueDestination: 'child1', element: 'test' },
          { id: '1.2', valueDestination: 'child2', element: 'test' },
        ],
      },
    ] as Array<IFormElement<any>>;

    const result = getFieldDefinitionsFromSchema(elements);
    expect(result).toHaveLength(2);
    expect(result[0]?.valueDestination).toBe('child1');
    expect(result[1]?.valueDestination).toBe('child2');
  });

  it('should handle deeply nested structures', () => {
    const elements: Array<IFormElement<any>> = [
      {
        id: '1',
        valueDestination: 'level1',
        element: 'test',
        children: [
          {
            id: '1.1',
            valueDestination: 'level2',
            element: 'test',
            children: [{ id: '1.1.1', valueDestination: 'level3', element: 'test' }],
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
