import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { IFormElement, TBaseFields } from '@ballerine/ui';
import { describe, expect, it } from 'vitest';
import { generateRevisionFieldsForAllElements } from './generate-revision-fields-for-all-elements';

describe('generateRevisionFieldsForAllElements', () => {
  // Arrange
  const mockContext = {
    documents: [
      {
        id: 'doc1',
        _document: {
          id: 'doc1',
          status: 'requested',
        },
      },
    ],
  } as unknown as CollectionFlowContext;

  it('should return empty array when no elements provided', () => {
    // Arrange

    // Act
    const result = generateRevisionFieldsForAllElements(mockContext, []);

    // Assert
    expect(result).toEqual([]);
  });

  it('should generate revision fields for all elements', () => {
    // Arrange
    const mockElements = [
      {
        element: 'textfield',
        id: 'field-1',
        valueDestination: 'someField',
      },
      {
        element: 'textfield',
        id: 'field-2',
        valueDestination: 'anotherField',
      },
    ] as Array<IFormElement<TBaseFields, any>>;

    // Act
    const result = generateRevisionFieldsForAllElements(mockContext, mockElements);

    // Assert
    expect(result).toEqual([
      {
        id: 'field-1-*',
        reason: '',
      },
      {
        id: 'field-2-*',
        reason: '',
      },
    ]);
  });

  it('should handle nested elements', () => {
    // Arrange
    const nestedContext = {
      entries: [
        {
          name: 'Entry 1',
          details: {
            address: '123 Main St',
          },
        },
      ],
    } as unknown as CollectionFlowContext;

    const mockedElements = [
      {
        id: 'fieldlist',
        element: 'fieldlist',
        valueDestination: 'entries',
        children: [
          {
            id: 'name',
            element: 'textfield',
            valueDestination: 'entries[$0].name',
          },
          {
            id: 'address',
            element: 'textfield',
            valueDestination: 'entries[$0].details.address',
          },
        ],
      },
    ] as Array<IFormElement<TBaseFields, any>>;

    // Act
    const result = generateRevisionFieldsForAllElements(nestedContext, mockedElements);

    // Assert
    expect(result).toEqual([
      {
        id: 'fieldlist-*',
        reason: '',
      },
      {
        id: 'name-*',
        reason: '',
      },
      {
        id: 'address-*',
        reason: '',
      },
    ]);
  });
});
