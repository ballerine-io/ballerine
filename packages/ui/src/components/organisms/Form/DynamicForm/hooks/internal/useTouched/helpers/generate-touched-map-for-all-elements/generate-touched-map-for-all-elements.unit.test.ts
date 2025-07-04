import { describe, expect, it } from 'vitest';
import { generateTouchedMapForAllElements } from './generate-touched-map-for-all-elements';
import { TUIElement } from '@ballerine/common';

describe('generateTouchedMapForAllElements', () => {
  it('should generate touched map for all elements', () => {
    const elements = [
      { id: '1', valueDestination: '1', children: [], element: 'textfield', params: {} },
      { id: '2', valueDestination: '2', children: [], element: 'textfield', params: {} },
    ] as TUIElement[];

    expect(generateTouchedMapForAllElements(elements, {})).toEqual({
      '1': true,
      '2': true,
    });
  });

  it('should generate touched map for all elements with children', () => {
    const elements: TUIElement[] = [
      {
        id: 'list',
        valueDestination: 'list',
        validate: [],
        element: 'fieldlist',
        params: {},
        children: [
          {
            id: 'firstName',
            valueDestination: 'list[$0].firstName',
            validate: [],
            element: 'textfield',
            params: {},
          },
          {
            id: 'lastName',
            valueDestination: 'list[$0].lastName',
            validate: [],
            params: {},
            element: 'textfield',
          },
          {
            id: 'innerList',
            valueDestination: 'list[$0].innerList',
            validate: [],
            params: {},
            element: 'fieldlist',
            children: [
              {
                id: 'innerValue',
                valueDestination: 'list[$0].innerList[$1].innerValue',
                validate: [],
                element: 'textfield',
                params: {},
              },
            ],
          },
        ],
      },
    ]

    const context = {
      list: [{ firstName: 'John', lastName: 'Doe', innerList: [{ innerValue: 'Inner' }] }],
    };

    expect(generateTouchedMapForAllElements(elements, context)).toEqual({
      list: true,
      'firstName-0': true,
      'lastName-0': true,
      'innerList-0': true,
      'innerValue-0-0': true,
    });
  });
});
