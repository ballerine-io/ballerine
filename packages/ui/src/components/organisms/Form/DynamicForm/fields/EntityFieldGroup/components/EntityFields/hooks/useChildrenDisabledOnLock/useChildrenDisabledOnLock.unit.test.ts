import { IFormElement } from '@/components/organisms/Form/DynamicForm/types';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useChildrenDisabledOnLock } from './useChildrenDisabledOnLock';

describe('useChildrenDisabledOnLock', () => {
  const mockElement: IFormElement = {
    id: 'test',
    element: 'test',
    valueDestination: 'test',
    children: [
      {
        id: 'child1',
        element: 'test',
        valueDestination: 'test.child1',
      },
      {
        id: 'child2',
        element: 'test',
        valueDestination: 'test.child2',
        children: [
          {
            id: 'grandchild',
            element: 'test',
            valueDestination: 'test.child2.grandchild',
          },
        ],
      },
    ],
    disable: [],
  };

  it('should return children as-is when not locked', () => {
    const { result } = renderHook(() => useChildrenDisabledOnLock(mockElement, false));
    expect(result.current).toEqual(mockElement.children);
  });

  it('should add disable rule to all children when locked', () => {
    const { result } = renderHook(() => useChildrenDisabledOnLock(mockElement, true));

    const expectedDisableRule = {
      engine: 'json-logic',
      value: {
        '==': [1, 1],
      },
    };

    // Check first level child
    expect(result.current?.[0]?.disable).toEqual([expectedDisableRule]);

    // Check second level child
    expect(result.current?.[1]?.disable).toEqual([expectedDisableRule]);

    // Check grandchild
    expect(result.current?.[1]?.children?.[0]?.disable).toEqual([expectedDisableRule]);
  });

  it('should handle element with no children', () => {
    const elementWithNoChildren: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
    };

    const { result } = renderHook(() => useChildrenDisabledOnLock(elementWithNoChildren, true));
    expect(result.current).toEqual([]);
  });

  it('should preserve existing disable rules when locking', () => {
    const elementWithExistingDisable: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
      children: [
        {
          id: 'child',
          element: 'test',
          valueDestination: 'test.child',
          disable: [
            {
              engine: 'json-logic',
              value: { '===': ['test', 'test'] },
            },
          ],
        },
      ],
    };

    const { result } = renderHook(() =>
      useChildrenDisabledOnLock(elementWithExistingDisable, true),
    );

    expect(result.current?.[0]?.disable).toEqual([
      {
        engine: 'json-logic',
        value: { '===': ['test', 'test'] },
      },
      {
        engine: 'json-logic',
        value: { '==': [1, 1] },
      },
    ]);
  });
});
