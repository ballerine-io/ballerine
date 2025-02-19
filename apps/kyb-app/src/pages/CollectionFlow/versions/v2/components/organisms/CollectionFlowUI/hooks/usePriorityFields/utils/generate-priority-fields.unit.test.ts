import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { generatePriorityFields } from './generate-priority-fields';

describe('generatePriorityFields', () => {
  const mockContext = {
    documents: [
      {
        id: 'doc1',
        decisionReason: 'needs_review',
      },
    ],
  } as unknown as CollectionFlowContext;

  const mockElements = [
    {
      element: 'documentfield',
      id: 'document-1',
      valueDestination: 'documents',
      params: {
        template: {
          id: 'doc1',
        },
      },
    },
  ];

  it('should return undefined when no priority fields found', () => {
    const result = generatePriorityFields([], mockContext);
    expect(result).toBeUndefined();
  });

  it('should generate priority fields for document elements', () => {
    const result = generatePriorityFields(mockElements, mockContext);

    expect(result).toEqual([
      {
        id: 'document-1',
        reason: 'needs_review',
      },
    ]);
  });

  it('should handle nested documents', () => {
    const nestedContext = {
      entries: [
        {
          documents: [
            {
              id: 'nested-doc-1',
              decisionReason: 'needs_review',
            },
          ],
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
            id: 'document',
            element: 'documentfield',
            valueDestination: 'entries[$0].documents',
            params: {
              template: {
                id: 'nested-doc-1',
              },
            },
          },
          {
            id: 'random-element',
            element: 'random-element',
            valueDestination: 'entries[$0].random-element',
          },
        ],
      },
    ];

    const result = generatePriorityFields(mockedElements, nestedContext);

    expect(result).toEqual([
      {
        id: 'document-0',
        reason: 'needs_review',
      },
    ]);
  });

  it('should generate priority document field only if document has decision reason', () => {
    const context = {
      ...mockContext,
      documents: [
        {
          id: 'doc1',
          // No decision reason
        },
      ],
    } as CollectionFlowContext;

    const result = generatePriorityFields(mockElements, context);

    expect(result).toBeUndefined();
  });
});
